import { allocate } from "~/lib/engine/allocator";
import { generateCode } from "~/lib/engine/codegen";
import type { Behavior } from "~/lib/engine/types";
import { describe, expect, test } from "vitest";

function gen(boardId: "arduino-uno" | "esp32" | "pico", componentIds: string[], behaviors: Behavior[] = []) {
    const { components } = allocate(boardId, componentIds);
    return generateCode(boardId, "Test Project", "test prompt", components, behaviors);
}

describe("codegen", () => {


    test('always includes Arduino.h', () => {
        const { code } = gen("arduino-uno", ["led"]);
        expect(code).toContain("#include <Arduino.h>");
    })

    test('has void setup() and void loop()', () => {
        const { code } = gen("arduino-uno", ["led"]);
        expect(code).toContain("void setup()");
        expect(code).toContain("void loop()");
    })

    test('header comment contains project name and board', () => {
        const { code } = gen("arduino-uno", ["led"]);
        expect(code).toContain("// Test Project");
        expect(code).toContain("Arduino Uno");
    })

    test('setup prints ready message', () => {
        const { code } = gen("arduino-uno", ["led"]);
        expect(code).toContain('Serial.begin(115200)');
        expect(code).toContain('Test Project ready.');
    })


    test('DHT22 adds DHT library include', () => {
        const { code } = gen("arduino-uno", ["dht22"]);
        expect(code).toContain("#include <DHT.h>");
    })

    test('OLED adds SSD1306 and GFX includes', () => {
        const { code } = gen("arduino-uno", ["oled"]);
        expect(code).toContain("#include <Adafruit_SSD1306.h>");
        expect(code).toContain("#include <Adafruit_GFX.h>");
        expect(code).toContain("#include <Wire.h>");
    })

    test('NeoPixel adds Adafruit NeoPixel include', () => {
        const { code } = gen("arduino-uno", ["neopixel"]);
        expect(code).toContain("#include <Adafruit_NeoPixel.h>");
    })

    test('LED without libraries has no extra includes', () => {
        const { code } = gen("arduino-uno", ["led"]);
        // Should only have Arduino.h, nothing else
        const includes = code.split("\n").filter(l => l.startsWith("#include"));
        expect(includes).toHaveLength(1);
        expect(includes[0]).toBe("#include <Arduino.h>");
    })


    test('LED pin define uses allocated board pin', () => {
        const { code } = gen("arduino-uno", ["led"]);
        // Allocator gives LED pin D2 on Uno
        expect(code).toContain("#define LED_PIN 2");
    })

    test('buzzer pin define on ESP32 uses GPIO number', () => {
        const { code } = gen("esp32", ["buzzer"]);
        // Should strip "GPIO" prefix → just the number
        expect(code).toMatch(/#define BUZZER_PIN \d+/);
    })


    test('behavior generates if/else block in loop', () => {
        const behaviors: Behavior[] = [{
            description: "When soil is dry, turn on relay",
            sensorId: "soil",
            actuatorId: "relay",
            comparator: "<",
            threshold: 1400,
            thresholdLabel: "dry threshold",
        }];
        const { code } = gen("arduino-uno", ["soil", "relay"], behaviors);
        expect(code).toContain("// When soil is dry, turn on relay");
        expect(code).toContain("< 1400");
        expect(code).toContain("digitalWrite(");
    })

    test('no behaviors means no React section in loop', () => {
        const { code } = gen("arduino-uno", ["led"]);
        expect(code).not.toContain("// --- React ---");
    })


    test('OLED with sensors generates dashboard code', () => {
        const { code } = gen("arduino-uno", ["dht22", "oled"]);
        expect(code).toContain("clearDisplay()");
        expect(code).toContain(".display()");
        expect(code).toContain("DHT22"); // sensor name on display
    })


    test('DHT22 projects use 2000ms delay', () => {
        const { code } = gen("arduino-uno", ["dht22"]);
        expect(code).toContain("delay(2000)");
    })

    test('non-DHT projects use 50ms delay', () => {
        const { code } = gen("arduino-uno", ["led"]);
        expect(code).toContain("delay(50)");
    })


    test('platformio.ini contains correct board for Uno', () => {
        const { platformioIni } = gen("arduino-uno", ["led"]);
        expect(platformioIni).toContain("board = uno");
        expect(platformioIni).toContain("platform = atmelavr");
        expect(platformioIni).toContain("framework = arduino");
    })

    test('platformio.ini contains correct board for ESP32', () => {
        const { platformioIni } = gen("esp32", ["led"]);
        expect(platformioIni).toContain("board = esp32dev");
        expect(platformioIni).toContain("platform = espressif32");
    })

    test('platformio.ini includes lib_deps when components need libraries', () => {
        const { platformioIni } = gen("arduino-uno", ["dht22"]);
        expect(platformioIni).toContain("lib_deps =");
        expect(platformioIni).toContain("DHT sensor library");
    })

    test('platformio.ini omits lib_deps when no libraries needed', () => {
        const { platformioIni } = gen("arduino-uno", ["led"]);
        expect(platformioIni).not.toContain("lib_deps");
    })
})
