import { BOARDS } from "./boards";
import { byId } from "./catalog";
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

  const counts = new Map<string, number>();

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

  for (const id of componentIds) {
    const comp = byId(id);
    const n = (counts.get(id) ?? 0) + 1;
    counts.set(id, n);
    const base = comp.shortName
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((w) => w[0]!.toUpperCase() + w.slice(1))
      .join("");
    const refName = `${base}${n > 1 ? `_${n}` : ""}`;

    const pins: AllocatedPin[] = [];
    let ok = true;

    for (const pin of comp.pins) {
      let boardPin = "";
      switch (pin.kind) {
        case "power": {
          const wantsV5 = pin.volts === 5;
          if (wantsV5 && board.volts === 3.3) {
            boardPin = board.powerPins.v5 ?? board.powerPins.v33;
            if (!board.powerPins.v5) {
              warnings.push(
                `${comp.shortName} prefers 5 V but ${board.label} tops out at 3.3 V — most modules still work, but check yours.`,
              );
            }
          } else {
            boardPin = wantsV5 ? board.powerPins.v5 ?? board.powerPins.v33 : board.powerPins.v33;
          }
          break;
        }
        case "gnd":
          boardPin = board.powerPins.gnd;
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

    if (!ok) {
      counts.set(id, n - 1);
      continue;
    }

    components.push({ component: comp, instance: n, refName, pins });
    for (const pin of pins) {
      wires.push({
        fromBoardPin: pin.boardPin,
        toComponent: refName,
        toPin: pin.name,
        color: pin.color,
        kind: pin.kind,
      });
    }
  }

  return { components, wires, warnings };
}
