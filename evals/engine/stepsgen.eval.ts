import { allocate } from "~/lib/engine/allocator";
import { generateBom, generateSteps } from "~/lib/engine/stepsgen";
import { describe, expect, test } from "vitest";

describe("stepsgen", () => {
    // 1. Assembly Steps 
    test('generateSteps creates expected start and end steps', () => {
        const { components, wires } = allocate("arduino-uno", ["led"]);
        const steps = generateSteps("arduino-uno", "Test Project", components, wires, []);

        expect(steps[0].title).toBe("Lay out your workbench");
        expect(steps[1].title).toBe("Seat the board and power rails");

        const lastStep = steps[steps.length - 1];
        expect(lastStep.title).toBe("Bring it to life");
    });

    test('creates a wiring step for each component', () => {
        const { components, wires } = allocate("arduino-uno", ["led", "buzzer"]);
        const steps = generateSteps("arduino-uno", "Test Project", components, wires, []);

        const ledStep = steps.find(s => s.title.includes("LED"));
        const buzzerStep = steps.find(s => s.title.includes("Buzzer"));

        expect(ledStep).toBeDefined();
        expect(buzzerStep).toBeDefined();
        expect(ledStep?.body).toContain("Tip:");
    });

    // 2. BOM Generation 
    test('generateBom aggregates duplicate components', () => {
        const { components } = allocate("arduino-uno", ["led", "led"]);
        const bom = generateBom(components);

        expect(bom).toHaveLength(1);
        expect(bom[0].qty).toBe(2);
        expect(bom[0].refs).toEqual(["LED", "LED_2"]);
        expect(bom[0].price).toBe(0.15); // Catalog LED price
    });

    test('generateBom creates separate entries for different components', () => {
        const { components } = allocate("arduino-uno", ["led", "button"]);
        const bom = generateBom(components);

        expect(bom).toHaveLength(2);
        expect(bom.map(b => b.name)).toEqual(expect.arrayContaining([
            expect.stringContaining("LED"),
            expect.stringContaining("button")
        ]));
    });
});
