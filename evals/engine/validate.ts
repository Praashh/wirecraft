import { expect } from "vitest";
import type { BuildResult } from "~/lib/engine/types";

export function validateBuildResult(result: BuildResult) {
    // Identity
    expect(result.name).toBeTruthy();
    expect(["arduino-uno", "esp32", "pico"]).toContain(result.board);
    expect(result.boardLabel).toBeTruthy();
    expect(result.summary).toBeTruthy();

    // Components & Wires
    expect(result.components.length).toBeGreaterThan(0);
    expect(result.wires.length).toBeGreaterThan(0);

    // Every wire must refer to a placed component
    const refNames = new Set(result.components.map(c => c.refName));
    for (const wire of result.wires) {
        expect(refNames.has(wire.toComponent)).toBe(true);
        expect(wire.fromBoardPin).toBeTruthy();
    }

    // Firmware
    expect(result.code).toContain("void setup()");
    expect(result.code).toContain("void loop()");
    expect(result.platformioIni).toContain("framework = arduino");

    // Steps & BOM
    expect(result.steps.length).toBeGreaterThanOrEqual(4);
    expect(result.bom.length).toBeGreaterThan(0);

    for (const item of result.bom) {
        expect(item.qty).toBeGreaterThan(0);
        expect(item.price).toBeGreaterThanOrEqual(0);
        expect(item.refs.length).toBe(item.qty);
    }
}
