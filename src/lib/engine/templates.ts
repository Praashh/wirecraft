import type { BoardId } from "./types";

export interface TemplateDef {
  slug: string;
  title: string;
  category: string;
  board: BoardId;
  prompt: string;
  summary: string;
  /** hue used for the procedural thumbnail */
  hue: number;
  /** icon id for the procedural thumbnail */
  icon: "plant" | "cloud" | "car" | "shield" | "lamp" | "pet" | "clock" | "game" | "music" | "chip" | "air" | "key";
}

export const TEMPLATES: TemplateDef[] = [
  {
    slug: "thirsty-plant-rescue",
    title: "Thirsty Plant Rescue",
    category: "Garden",
    board: "esp32",
    prompt: "A plant waterer that reads soil moisture and runs a small pump through a relay when the pot gets dry, with a display showing the readings",
    summary: "Soil probe + relay-driven pump. Your ferns will never sulk again.",
    hue: 145,
    icon: "plant",
  },
  {
    slug: "desk-weather-station",
    title: "Desk Weather Station",
    category: "Smart Home",
    board: "esp32",
    prompt: "A weather station that shows temperature and humidity on an OLED display",
    summary: "DHT22 climate readings on a crisp little OLED dashboard.",
    hue: 210,
    icon: "cloud",
  },
  {
    slug: "garage-parking-pal",
    title: "Garage Parking Pal",
    category: "Vehicles",
    board: "arduino-uno",
    prompt: "A parking sensor that beeps faster as the car gets too close, with a warning LED",
    summary: "Ultrasonic ranger + buzzer. Stop exactly where the tennis ball used to hang.",
    hue: 28,
    icon: "car",
  },
  {
    slug: "doorway-watchdog",
    title: "Doorway Watchdog",
    category: "Security",
    board: "arduino-uno",
    prompt: "A motion alarm with a PIR sensor, a loud buzzer, an LED, and a button to arm and disarm it",
    summary: "PIR motion alarm with an arm/disarm button. Cats will trigger it. Often.",
    hue: 355,
    icon: "shield",
  },
  {
    slug: "sunset-mood-lamp",
    title: "Sunset Mood Lamp",
    category: "Ambient",
    board: "esp32",
    prompt: "A mood lamp with a NeoPixel ring, a button to cycle colors and a knob for brightness",
    summary: "NeoPixel ring, one button, one knob — infinite vibes.",
    hue: 275,
    icon: "lamp",
  },
  {
    slug: "midnight-night-light",
    title: "Midnight Night Light",
    category: "Ambient",
    board: "pico",
    prompt: "A night light that fades on when the room gets dark using a light sensor and neopixels",
    summary: "An LDR watches the dusk; the pixels take it from there.",
    hue: 245,
    icon: "lamp",
  },
  {
    slug: "good-dog-dispenser",
    title: "Good Dog Dispenser",
    category: "Pets",
    board: "arduino-uno",
    prompt: "A pet treat dispenser where pressing a button makes a servo open a hatch, with a display showing a happy face",
    summary: "Button-activated servo hatch. Treats rain down; loyalty skyrockets.",
    hue: 40,
    icon: "pet",
  },
  {
    slug: "fresh-air-sentinel",
    title: "Fresh Air Sentinel",
    category: "Smart Home",
    board: "esp32",
    prompt: "An air quality monitor with a gas sensor, OLED readout, warning LED and a buzzer for bad air",
    summary: "MQ-135 sniffs the room and nags you to open a window.",
    hue: 180,
    icon: "air",
  },
  {
    slug: "secret-badge-chest",
    title: "Secret Badge Chest",
    category: "Adventure",
    board: "arduino-uno",
    prompt: "An RFID treasure chest that unlocks a servo latch and chirps when the right card is presented",
    summary: "RC522 reader + servo latch. Only the chosen fob may open it.",
    hue: 320,
    icon: "key",
  },
  {
    slug: "deep-focus-timer",
    title: "Deep Focus Timer",
    category: "Productivity",
    board: "pico",
    prompt: "A pomodoro focus timer with an OLED display, rotary encoder to set minutes, and a buzzer when time is up",
    summary: "Twist the encoder, watch the countdown, obey the buzzer.",
    hue: 200,
    icon: "clock",
  },
  {
    slug: "lightning-reflex-tower",
    title: "Lightning Reflex Tower",
    category: "Games",
    board: "arduino-uno",
    prompt: "A reaction game with three LEDs, a button and a buzzer that scores how fast you react",
    summary: "Three LEDs, one button, zero mercy for slow thumbs.",
    hue: 55,
    icon: "game",
  },
  {
    slug: "pixel-desk-buddy",
    title: "Pixel Desk Buddy",
    category: "Companions",
    board: "esp32",
    prompt: "A cute desk companion robot with an OLED face, a button to interact, a buzzer for chirps and neopixels for emotion colors",
    summary: "An OLED face that chirps, blinks and judges your posture.",
    hue: 165,
    icon: "chip",
  },
  {
    slug: "dawn-chorus-alarm",
    title: "Dawn Chorus Alarm",
    category: "Time",
    board: "esp32",
    prompt: "An alarm clock with an OLED display, rotary encoder to set the alarm, buzzer melodies and a light sensor to dim at night",
    summary: "An alarm that dims itself at night like a considerate roommate.",
    hue: 15,
    icon: "clock",
  },
  {
    slug: "one-string-laser-band",
    title: "One-String Laser Band",
    category: "Music",
    board: "pico",
    prompt: "A light-beam musical instrument where breaking a light sensor beam plays buzzer tones, with a knob for pitch",
    summary: "Break the beam, play a note. The neighbors will have opinions.",
    hue: 300,
    icon: "music",
  },
  {
    slug: "porch-package-guard",
    title: "Porch Package Guard",
    category: "Security",
    board: "esp32",
    prompt: "A porch security monitor with an ultrasonic sensor watching for packages, a PIR for motion, and a buzzer alert",
    summary: "Knows when the parcel lands — and when someone eyes it.",
    hue: 5,
    icon: "shield",
  },
  {
    slug: "window-farm-monitor",
    title: "Window Farm Monitor",
    category: "Garden",
    board: "pico",
    prompt: "A window herb garden monitor with soil moisture, light sensor and temperature on an OLED display",
    summary: "Soil, sun and warmth on one tiny dashboard. Basil approved.",
    hue: 110,
    icon: "plant",
  },
];

export const templateBySlug = (slug: string) => TEMPLATES.find((t) => t.slug === slug);
