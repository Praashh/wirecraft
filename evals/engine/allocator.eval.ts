import { allocate } from "~/lib/engine/allocator";
import { describe, expect, test } from "vitest";

const UNO_PWM_PINS = ["D3", "D5", "D6", "D9", "D10", "D11"];

describe("allocator", () => {


    test('led gets a digital pin and GND on arduino', () => {
        const result = allocate("arduino-uno", ["led"]);
        expect(result.components).toHaveLength(1);
        expect(result.components[0].pins[0].kind).toBe("digital");
        expect(result.components[0].pins[0].boardPin).toBe("D2");
        expect(result.components[0].pins[1].boardPin).toBe("GND");
        expect(result.wires).toHaveLength(2);
        expect(result.warnings).toHaveLength(0);
    })

    test('oled gets I2C SDA/SCL pins on arduino', () => {
        const result = allocate("arduino-uno", ["oled"]);
        expect(result.components).toHaveLength(1);
        const pins = result.components[0].pins;
        const sda = pins.find(p => p.kind === "i2c-sda");
        const scl = pins.find(p => p.kind === "i2c-scl");
        expect(sda?.boardPin).toBe("A4");
        expect(scl?.boardPin).toBe("A5");
        expect(result.warnings).toHaveLength(0);
    })


    test('buzzer gets a PWM-capable pin', () => {
        const result = allocate("arduino-uno", ["buzzer"]);
        expect(result.components).toHaveLength(1);
        const sigPin = result.components[0].pins.find(p => p.kind === "pwm");
        expect(sigPin).toBeDefined();
        expect(UNO_PWM_PINS).toContain(sigPin!.boardPin);
        expect(result.warnings).toHaveLength(0);
    })

    test('led and button get separate pins', () => {
        const result = allocate("arduino-uno", ["led", "button"]);
        expect(result.components).toHaveLength(2);
        const ledSignal = result.components[0].pins[0].boardPin;
        const btnSignal = result.components[1].pins[0].boardPin;
        expect(ledSignal).not.toBe(btnSignal);
        expect(result.warnings).toHaveLength(0);
    })


    test('too many components triggers warnings', () => {
        // Arduino Uno has 16 signal pins — 17 LEDs should overflow
        const ids = Array(17).fill("led");
        const result = allocate("arduino-uno", ids);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.components.length).toBeLessThan(ids.length);
    })


    test('led on esp32 gets GPIO pin instead of Dx pin', () => {
        const result = allocate("esp32", ["led"]);
        expect(result.components).toHaveLength(1);
        expect(result.components[0].pins[0].boardPin).toMatch(/^GPIO\d+$/);
        expect(result.warnings).toHaveLength(0);
    })

    test('led on pico gets GPx pin', () => {
        const result = allocate("pico", ["led"]);
        expect(result.components).toHaveLength(1);
        expect(result.components[0].pins[0].boardPin).toMatch(/^GP\d+$/);
        expect(result.warnings).toHaveLength(0);
    })


    test('5V component on 3.3V board without 5V pin emits voltage warning', () => {
        // Ultrasonic wants 5V power; Pico is 3.3V AND has no 5V pin at all
        // (ESP32 has VIN so it wouldn't warn)
        const result = allocate("pico", ["ultrasonic"]);
        expect(result.components).toHaveLength(1);
        expect(result.warnings.some(w => w.includes("3.3 V"))).toBe(true);
    })

    test('5V component on 5V board emits no voltage warning', () => {
        // Ultrasonic wants 5V; Arduino Uno is a 5V board — no problem
        const result = allocate("arduino-uno", ["ultrasonic"]);
        expect(result.components).toHaveLength(1);
        expect(result.warnings).toHaveLength(0);
    })


    test('wire count equals total allocated pins', () => {
        const result = allocate("arduino-uno", ["led", "buzzer", "oled"]);
        const totalPins = result.components.reduce((sum, c) => sum + c.pins.length, 0);
        expect(result.wires).toHaveLength(totalPins);
    })


    test('empty component list returns empty result', () => {
        const result = allocate("arduino-uno", []);
        expect(result.components).toHaveLength(0);
        expect(result.wires).toHaveLength(0);
        expect(result.warnings).toHaveLength(0);
    })
})
