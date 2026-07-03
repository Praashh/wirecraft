import type { Behavior } from "../types";
import type { ParsingContext, ParsingStrategy } from "./ParsingStrategy";
import { hasKw } from "./utils";

interface Recipe {
  keywords: string[];
  name: string;
  components: string[];
  behaviors: Behavior[];
}

const RECIPES: Recipe[] = [
  {
    keywords: ["plant", "soil", "water my", "irrigat", "garden", "flower"],
    name: "Plant Waterer",
    components: ["soil", "relay", "led", "oled"],
    behaviors: [
      {
        description: "When the soil reads dry, switch the pump relay on until it recovers.",
        sensorId: "soil",
        actuatorId: "relay",
        comparator: "<",
        threshold: 1400,
        thresholdLabel: "dry-soil threshold (calibrate for your pot)",
      },
    ],
  },
  {
    keywords: ["weather", "temperature", "humidity", "climate", "thermometer"],
    name: "Weather Station",
    components: ["dht22", "oled", "led"],
    behaviors: [],
  },
  {
    keywords: ["parking", "distance", "proximity", "reversing", "too close"],
    name: "Parking Sensor",
    components: ["ultrasonic", "buzzer", "led"],
    behaviors: [
      {
        description: "Beep and light up when something comes within 30 cm.",
        sensorId: "ultrasonic",
        actuatorId: "buzzer",
        comparator: "<",
        threshold: 30,
        thresholdLabel: "trigger distance in cm",
      },
      {
        description: "Mirror the alarm on the indicator LED.",
        sensorId: "ultrasonic",
        actuatorId: "led",
        comparator: "<",
        threshold: 30,
        thresholdLabel: "trigger distance in cm",
      },
    ],
  },
  {
    keywords: ["intruder", "security", "alarm", "motion", "burglar", "tripwire", "watchdog"],
    name: "Motion Alarm",
    components: ["pir", "buzzer", "led", "button"],
    behaviors: [
      {
        description: "Sound the buzzer when motion is detected; the button arms and disarms.",
        sensorId: "pir",
        actuatorId: "buzzer",
        comparator: ">",
        threshold: 0,
        thresholdLabel: "motion detected",
      },
    ],
  },
  {
    keywords: ["mood", "lamp", "ambient", "rgb", "neopixel", "disco", "party light"],
    name: "Mood Lamp",
    components: ["neopixel", "button", "pot"],
    behaviors: [],
  },
  {
    keywords: ["night light", "dark", "dusk", "brightness", "light sensor"],
    name: "Night Light",
    components: ["ldr", "neopixel"],
    behaviors: [
      {
        description: "Fade the pixels on when the room gets dark.",
        sensorId: "ldr",
        actuatorId: "neopixel",
        comparator: "<",
        threshold: 800,
        thresholdLabel: "darkness threshold",
      },
    ],
  },
  {
    keywords: ["pet", "feeder", "treat", "dispens", "cat", "dog"],
    name: "Treat Dispenser",
    components: ["servo", "button", "oled"],
    behaviors: [
      {
        description: "Press the button, the servo swings the hatch open for a moment.",
        sensorId: "button",
        actuatorId: "servo",
        comparator: ">",
        threshold: 0,
        thresholdLabel: "button pressed",
      },
    ],
  },
  {
    keywords: ["air quality", "co2", "gas", "smoke", "pollution", "vent"],
    name: "Air Quality Monitor",
    components: ["gas", "oled", "led", "buzzer"],
    behaviors: [
      {
        description: "Warn with the buzzer when air quality drops past the threshold.",
        sensorId: "gas",
        actuatorId: "buzzer",
        comparator: ">",
        threshold: 2200,
        thresholdLabel: "bad-air threshold (calibrate after burn-in)",
      },
    ],
  },
  {
    keywords: ["rfid", "badge", "card", "treasure", "access", "unlock", "chest"],
    name: "RFID Lock",
    components: ["rfid", "servo", "led", "buzzer"],
    behaviors: [
      {
        description: "When a card is presented, chirp and swing the latch open.",
        sensorId: "rfid",
        actuatorId: "servo",
        comparator: ">",
        threshold: 0,
        thresholdLabel: "card detected",
      },
    ],
  },
  {
    keywords: ["clock", "timer", "pomodoro", "focus", "countdown"],
    name: "Focus Timer",
    components: ["oled", "encoder", "buzzer"],
    behaviors: [],
  },
  {
    keywords: ["reaction", "game", "arcade", "whack"],
    name: "Reaction Game",
    components: ["led", "led", "led", "button", "buzzer"],
    behaviors: [],
  },
  {
    keywords: ["desk buddy", "companion", "robot face", "tamagotchi", "pet robot", "buddy"],
    name: "Desk Companion",
    components: ["oled", "button", "buzzer", "neopixel"],
    behaviors: [],
  },
];

export class RecipeMatchStrategy implements ParsingStrategy {
  apply(ctx: ParsingContext): void {
    let best: Recipe | null = null;
    let bestScore = 0;

    for (const r of RECIPES) {
      const score = r.keywords.filter((k) => hasKw(ctx.lower, k)).length;
      if (score > bestScore) {
        best = r;
        bestScore = score;
      }
    }

    if (best) {
      ctx.recipeName = best.name;
      ctx.componentIds.push(...best.components);
      ctx.behaviors.push(...best.behaviors);
    }
  }
}
