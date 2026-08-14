import { describe, expect, test } from "vitest";
import { parsePrompt } from "~/lib/engine/parser";

describe("parser", () => {
    test("matches Plant Waterer recipe from prompt", () => {
        const intent = parsePrompt("I want to eater my plant automatically");

        expect(intent.projectName).toBe("Plant Waterer");
        expect(intent.componentIds).toContain("soil");
        expect(intent.componentIds).toContain("relay");
        expect(intent.behaviors).toHaveLength(1);
        expect(intent.behaviors[0].sensorId).toBe("soil");
        expect(intent.behaviors[0].actuatorId).toBe("relay");
    });

    test("matches Weather Station recipe", () => {
        const intent = parsePrompt("Build a weather station thermometer");

        expect(intent.projectName).toBe("Weather Station");
        expect(intent.componentIds).toEqual(expect.arrayContaining(["dht22", "oled", "led"]));
    });

    test('extracts direct catalog components from text', () => {
        const intent = parsePrompt("Add a servo and an oled display");
        expect(intent.componentIds).toContain("servo");
        expect(intent.componentIds).toContain("oled");
    });

    test('gibberish prompt falls back to default led + button starter', () => {
        const intent = parsePrompt("asdfghjk 12345");
        expect(intent.componentIds).toEqual(["led", "button"]);
        expect(intent.board).toBe("esp32");
    });

    test('caps components at maximum 6', () => {
        const intent = parsePrompt("plant weather parking intruder mood night light pet feeder");
        expect(intent.componentIds.length).toBeLessThanOrEqual(6);
    });
});