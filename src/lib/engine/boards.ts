import type { BoardId, PinKind } from "./types";

export interface BoardPinDef {
  label: string;
  kinds: PinKind[];
}

export interface BoardDef {
  id: BoardId;
  label: string;
  chip: string;
  volts: 3.3 | 5;
  framework: "arduino";
  pioBoard: string;
  pioPlatform: string;
  /** ordered signal pins available for allocation */
  pins: BoardPinDef[];
  i2c: { sda: string; scl: string };
  powerPins: { v5?: string; v33: string; gnd: string };
  /** left-side / right-side pin labels for the SVG rendering, top to bottom */
  svg: { left: string[]; right: string[]; color: string; name: string };
}

export const BOARDS: Record<BoardId, BoardDef> = {
  "arduino-uno": {
    id: "arduino-uno",
    label: "Arduino Uno",
    chip: "ATmega328P",
    volts: 5,
    framework: "arduino",
    pioBoard: "uno",
    pioPlatform: "atmelavr",
    pins: [
      { label: "D2", kinds: ["digital"] },
      { label: "D3", kinds: ["digital", "pwm"] },
      { label: "D4", kinds: ["digital"] },
      { label: "D5", kinds: ["digital", "pwm"] },
      { label: "D6", kinds: ["digital", "pwm"] },
      { label: "D7", kinds: ["digital"] },
      { label: "D8", kinds: ["digital"] },
      { label: "D9", kinds: ["digital", "pwm"] },
      { label: "D10", kinds: ["digital", "pwm"] },
      { label: "D11", kinds: ["digital", "pwm"] },
      { label: "D12", kinds: ["digital"] },
      { label: "D13", kinds: ["digital"] },
      { label: "A0", kinds: ["analog", "digital"] },
      { label: "A1", kinds: ["analog", "digital"] },
      { label: "A2", kinds: ["analog", "digital"] },
      { label: "A3", kinds: ["analog", "digital"] },
    ],
    i2c: { sda: "A4", scl: "A5" },
    powerPins: { v5: "5V", v33: "3V3", gnd: "GND" },
    svg: {
      left: ["RST", "3V3", "5V", "GND", "GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5"],
      right: ["D13", "D12", "D11", "D10", "D9", "D8", "D7", "D6", "D5", "D4", "D3", "D2"],
      color: "#1E7A8C",
      name: "UNO",
    },
  },
  esp32: {
    id: "esp32",
    label: "ESP32 DevKit",
    chip: "ESP32-WROOM-32",
    volts: 3.3,
    framework: "arduino",
    pioBoard: "esp32dev",
    pioPlatform: "espressif32",
    pins: [
      { label: "GPIO4", kinds: ["digital", "pwm"] },
      { label: "GPIO5", kinds: ["digital", "pwm"] },
      { label: "GPIO13", kinds: ["digital", "pwm"] },
      { label: "GPIO14", kinds: ["digital", "pwm"] },
      { label: "GPIO16", kinds: ["digital", "pwm"] },
      { label: "GPIO17", kinds: ["digital", "pwm"] },
      { label: "GPIO18", kinds: ["digital", "pwm"] },
      { label: "GPIO19", kinds: ["digital", "pwm"] },
      { label: "GPIO23", kinds: ["digital", "pwm"] },
      { label: "GPIO25", kinds: ["digital", "pwm"] },
      { label: "GPIO26", kinds: ["digital", "pwm"] },
      { label: "GPIO27", kinds: ["digital", "pwm"] },
      { label: "GPIO32", kinds: ["analog", "digital", "pwm"] },
      { label: "GPIO33", kinds: ["analog", "digital", "pwm"] },
      { label: "GPIO34", kinds: ["analog"] },
      { label: "GPIO35", kinds: ["analog"] },
    ],
    i2c: { sda: "GPIO21", scl: "GPIO22" },
    powerPins: { v5: "VIN", v33: "3V3", gnd: "GND" },
    svg: {
      left: ["3V3", "GND", "GPIO15", "GPIO4", "GPIO16", "GPIO17", "GPIO5", "GPIO18", "GPIO19", "GPIO21", "GPIO22", "GPIO23"],
      right: ["VIN", "GND", "GPIO13", "GPIO14", "GPIO27", "GPIO26", "GPIO25", "GPIO33", "GPIO32", "GPIO35", "GPIO34", "EN"],
      color: "#3A3F47",
      name: "ESP32",
    },
  },
  pico: {
    id: "pico",
    label: "Raspberry Pi Pico",
    chip: "RP2040",
    volts: 3.3,
    framework: "arduino",
    pioBoard: "pico",
    pioPlatform: "raspberrypi",
    pins: [
      { label: "GP2", kinds: ["digital", "pwm"] },
      { label: "GP3", kinds: ["digital", "pwm"] },
      { label: "GP6", kinds: ["digital", "pwm"] },
      { label: "GP7", kinds: ["digital", "pwm"] },
      { label: "GP8", kinds: ["digital", "pwm"] },
      { label: "GP9", kinds: ["digital", "pwm"] },
      { label: "GP10", kinds: ["digital", "pwm"] },
      { label: "GP11", kinds: ["digital", "pwm"] },
      { label: "GP12", kinds: ["digital", "pwm"] },
      { label: "GP13", kinds: ["digital", "pwm"] },
      { label: "GP14", kinds: ["digital", "pwm"] },
      { label: "GP15", kinds: ["digital", "pwm"] },
      { label: "GP26", kinds: ["analog", "digital"] },
      { label: "GP27", kinds: ["analog", "digital"] },
      { label: "GP28", kinds: ["analog", "digital"] },
    ],
    i2c: { sda: "GP4", scl: "GP5" },
    powerPins: { v33: "3V3", gnd: "GND" },
    svg: {
      left: ["GP0", "GP1", "GND", "GP2", "GP3", "GP4", "GP5", "GND", "GP6", "GP7", "GP8", "GP9"],
      right: ["VBUS", "VSYS", "GND", "3V3", "GP28", "GND", "GP27", "GP26", "GP22", "GND", "GP15", "GP14"],
      color: "#1D5C3F",
      name: "PICO",
    },
  },
};

export const BOARD_ORDER: BoardId[] = ["arduino-uno", "esp32", "pico"];
