import { BOARDS } from "./boards";
import { ComponentFactory } from "./ComponentFactory";
import type {
  AllocatedPin,
  BoardId,
  PlacedComponent,
  WireRun,
} from "./types";

export interface AllocationResult {
  components: PlacedComponent[];
  wires: WireRun[];
  warnings: string[];
}

export function allocate(boardId: BoardId, componentIds: string[]): AllocationResult {
  const board = BOARDS[boardId];
  const used = new Set<string>();
  const warnings: string[] = [];
  const components: PlacedComponent[] = [];
  const wires: WireRun[] = [];
  const factory = new ComponentFactory();

  const take = (kinds: ("digital" | "pwm" | "analog")[]): string | null => {
    for (const kind of kinds) {
      for (const pin of board.pins) {
        if (used.has(pin.label)) continue;
        if (pin.kinds.includes(kind)) {
          used.add(pin.label);
          return pin.label;
        }
      }
    }
    return null;
  };

  const { v5, v33, gnd } = board.powerPins;

  for (const id of componentIds) {
    const comp = factory.getCatalogComponent(id);

    const pins: AllocatedPin[] = [];
    let ok = true;

    for (const pin of comp.pins) {
      let boardPin = "";
      switch (pin.kind) {
        case "power": {
          const wantsV5 = pin.volts === 5;
          if (wantsV5 && board.volts === 3.3) {
            boardPin = v5 ?? v33;
            if (!v5) {
              warnings.push(
                `${comp.shortName} prefers 5 V but ${board.label} tops out at 3.3 V — most modules still work, but check yours.`,
              );
            }
          } else {
            boardPin = wantsV5 ? v5 ?? v33 : v33;
          }
          break;
        }
        case "gnd":
          boardPin = gnd;
          break;
        case "i2c-sda":
          boardPin = board.i2c.sda;
          break;
        case "i2c-scl":
          boardPin = board.i2c.scl;
          break;
        case "analog": {
          const p = take(["analog"]);
          if (!p) {
            ok = false;
            warnings.push(`Ran out of analog pins for ${comp.shortName} — dropped it from the build.`);
          } else boardPin = p;
          break;
        }
        case "pwm": {
          const p = take(["pwm", "digital"]);
          if (!p) {
            ok = false;
            warnings.push(`Ran out of PWM pins for ${comp.shortName} — dropped it from the build.`);
          } else boardPin = p;
          break;
        }
        case "digital": {
          const p = take(["digital", "pwm"]);
          if (!p) {
            ok = false;
            warnings.push(`Ran out of digital pins for ${comp.shortName} — dropped it from the build.`);
          } else boardPin = p;
          break;
        }
      }
      if (!ok) break;
      pins.push({ ...pin, boardPin });
    }

    if (!ok) continue;

    const { placed, wires: componentWires } = factory.createPlacedComponent(id, comp, pins);
    components.push(placed);
    wires.push(...componentWires);
  }

  return { components, wires, warnings };
}
