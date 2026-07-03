import Groq from "groq-sdk";
import { CATALOG } from "./catalog";
import { BOARDS, BOARD_ORDER } from "./boards";
import type { Behavior, BoardId, BuildResult, ParsedIntent } from "./types";


const CATALOG_SUMMARY = CATALOG.map((c) => ({
  id: c.id,
  name: c.name,
  shortName: c.shortName,
  category: c.category,
  summary: c.summary,
  hasSensor: !!c.readingVar,
  hasActuator: !!c.actuate,
}));

const BOARD_SUMMARY = BOARD_ORDER.map((id) => {
  const b = BOARDS[id];
  return { id: b.id, label: b.label, chip: b.chip, volts: b.volts, pinCount: b.pins.length };
});

const SYSTEM_PROMPT = `You are the brain of Wirecraft, a hardware project designer for Arduino Uno, ESP32, and Raspberry Pi Pico.

Given a user's natural-language description of a gadget, you must select the best microcontroller board and components from the catalog below, then define sensor-to-actuator behaviors.

AVAILABLE BOARDS:
${JSON.stringify(BOARD_SUMMARY, null, 2)}

AVAILABLE COMPONENTS (you MUST only use IDs from this list):
${JSON.stringify(CATALOG_SUMMARY, null, 2)}

RULES:
1. Pick the board that best fits the project. Default to "esp32" if unclear.
2. Select 1-6 components from the catalog by their "id". Only use IDs that exist in the list above.
3. For each sensor→actuator pair that should interact, define a behavior with:
   - description: a one-sentence human-readable rule
   - sensorId: the component id of the sensor (must have hasSensor=true)
   - actuatorId: the component id of the actuator (must have hasActuator=true)
   - comparator: "<" or ">"
   - threshold: a numeric trigger value
   - thresholdLabel: what the threshold represents
4. Give the project a short, catchy name (2-4 words).
5. If the user asks for something impossible or unrelated to hardware, still pick a reasonable starter project.
6. Prefer adding an "oled" display when the project has sensors — it makes dashboards automatic.

You MUST respond with ONLY valid JSON matching this schema:
{
  "board": "arduino-uno" | "esp32" | "pico",
  "componentIds": ["id1", "id2", ...],
  "projectName": "Short Name",
  "behaviors": [
    {
      "description": "...",
      "sensorId": "...",
      "actuatorId": "...",
      "comparator": "<" | ">",
      "threshold": 123,
      "thresholdLabel": "..."
    }
  ]
}`;

interface RawAIResponse {
  board?: string;
  componentIds?: string[];
  projectName?: string;
  behaviors?: Behavior[];
}

function validateIntent(raw: RawAIResponse, preferredBoard?: BoardId): ParsedIntent {
  const board: BoardId = BOARD_ORDER.includes(raw.board as BoardId)
    ? (raw.board as BoardId)
    : preferredBoard ?? "esp32";

  const validIds = new Set(CATALOG.map((c) => c.id));
  const componentIds = (raw.componentIds ?? [])
    .filter((id) => validIds.has(id))
    .slice(0, 6);

  if (componentIds.length === 0) {
    componentIds.push("led", "button");
  }

  const behaviors = (raw.behaviors ?? []).filter(
    (b) =>
      componentIds.includes(b.sensorId) &&
      componentIds.includes(b.actuatorId) &&
      (b.comparator === "<" || b.comparator === ">") &&
      typeof b.threshold === "number",
  );

  return {
    board,
    componentIds,
    projectName: raw.projectName || "Smart Gadget",
    behaviors,
  };
}

let _groq: Groq | null = null;

function getGroq(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ_API_KEY is not set. Wirecraft requires AI to design hardware projects. " +
      "Get a free key at https://console.groq.com/keys and add it to your .env file.",
    );
  }
  if (!_groq) _groq = new Groq({ apiKey: key });
  return _groq;
}

export async function aiParsePrompt(
  prompt: string,
  preferredBoard?: BoardId,
): Promise<ParsedIntent> {
  const groq = getGroq();

  const userMessage = preferredBoard
    ? `${prompt}\n\n(User prefers the ${BOARDS[preferredBoard].label} board.)`
    : prompt;

  const chat = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 1024,
    response_format: { type: "json_object" },
  });

  const text = chat.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("AI returned an empty response. Please try rephrasing your idea.");
  }

  const raw = JSON.parse(text) as RawAIResponse;
  return validateIntent(raw, preferredBoard);
}

export async function aiAssistantReply(
  prompt: string,
  result: BuildResult,
): Promise<string> {
  const groq = getGroq();

  const chat = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `You are Wirecraft's friendly hardware assistant. The user asked: "${prompt}".

The build engine produced this project:
- Name: ${result.name}
- Board: ${result.boardLabel}
- Parts: ${result.bom.map((b) => `${b.qty}× ${b.name}`).join(", ")}
- Wires: ${result.wires.length} connections
- Summary: ${result.summary}
${result.warnings.length ? `- Warnings: ${result.warnings.join("; ")}` : ""}

Write a short, friendly reply (max 100 words) presenting the build. Use **bold** for emphasis. End by inviting follow-up tweaks. Do not invent parts that are not listed.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  const reply = chat.choices[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error("AI returned an empty assistant reply.");
  }
  return reply;
}
