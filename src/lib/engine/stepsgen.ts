import { BOARDS } from "./boards";
import type { Behavior, BoardId, BuildStep, PlacedComponent, WireRun } from "./types";

export function generateSteps(
  boardId: BoardId,
  name: string,
  comps: PlacedComponent[],
  wires: WireRun[],
  behaviors: Behavior[],
): BuildStep[] {
  const board = BOARDS[boardId];
  const steps: BuildStep[] = [];

  steps.push({
    title: "Lay out your workbench",
    body: `Gather the ${board.label}, a half-size breadboard, and a bundle of male-to-male jumper wires. Keep the parts list open — every component below gets its own spot on the breadboard. Don't plug in USB power until the last wire is placed.`,
  });

  steps.push({
    title: "Seat the board and power rails",
    body: `Run a red jumper from the ${board.label}'s ${board.powerPins.v33}${board.powerPins.v5 ? ` (or ${board.powerPins.v5} for 5 V parts)` : ""} pin to the breadboard's + rail, and a black jumper from ${board.powerPins.gnd} to the − rail. Every component's power and ground will tap these rails.`,
  });

  for (const pc of comps) {
    const sig = pc.pins.filter((p) => p.kind !== "power" && p.kind !== "gnd");
    const pwr = pc.pins.filter((p) => p.kind === "power" || p.kind === "gnd");
    const sigText = sig
      .map((p) => `${p.name} → ${p.boardPin}`)
      .join(", ");
    const pwrText = pwr
      .map((p) => `${p.name} → ${p.kind === "gnd" ? "− rail" : "+ rail"}`)
      .join(", ");
    steps.push({
      title: `Wire the ${pc.component.shortName}${pc.instance > 1 ? ` #${pc.instance}` : ""}`,
      body: [
        `Place the ${pc.component.name} on the breadboard.`,
        pwrText ? `Power first: ${pwrText}.` : "",
        sigText ? `Then signals: ${sigText}.` : "",
        `Tip: ${pc.component.buildTip}`,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  steps.push({
    title: "Double-check before power",
    body: `Trace every wire against the diagram once more — ${wires.length} connections in total. The classic mistakes: swapped power and ground, and off-by-one rows on the breadboard. Thirty seconds of checking saves a component.`,
  });

  steps.push({
    title: "Flash the firmware",
    body: `Open the exported folder in VS Code with the PlatformIO extension (free), plug in the ${board.label} over USB, and hit Upload. PlatformIO fetches the libraries listed in platformio.ini automatically. Prefer the Arduino IDE? Copy src/main.cpp into a new sketch and install the same libraries from the Library Manager.`,
  });

  steps.push({
    title: "Bring it to life",
    body:
      behaviors.length > 0
        ? `Open the Serial Monitor at 115200 baud to watch live readings. ${behaviors
            .map((b) => b.description)
            .join(" ")} Adjust the thresholds at the top of the sketch to match your environment.`
        : `Open the Serial Monitor at 115200 baud — you should see "${name} ready." Then start customizing the loop; the sketch is organized so every component's code is easy to find.`,
  });

  return steps;
}

export function generateBom(comps: PlacedComponent[]) {
  const map = new Map<string, { name: string; qty: number; price: number; refs: string[] }>();
  for (const pc of comps) {
    const e = map.get(pc.component.id) ?? {
      name: pc.component.name,
      qty: 0,
      price: pc.component.price,
      refs: [],
    };
    e.qty += 1;
    e.refs.push(pc.refName);
    map.set(pc.component.id, e);
  }
  return [...map.values()];
}
