import { allocate } from "./allocator";
import { aiAssistantReply, aiParsePrompt } from "./ai";
import { BOARDS } from "./boards";
import { generateCode } from "./codegen";
import { parsePrompt } from "./parser";
import { generateBom, generateSteps } from "./stepsgen";
import type { BoardId, BuildResult } from "./types";

export async function buildProject(
  prompt: string,
  preferredBoard?: BoardId,
  options?: { offline?: boolean },
): Promise<BuildResult> {
  const intent = options?.offline
    ? parsePrompt(prompt, preferredBoard)
    : await aiParsePrompt(prompt, preferredBoard);

  const board = BOARDS[intent.board];
  const { components, wires, warnings } = allocate(intent.board, intent.componentIds);
  const { code, platformioIni } = generateCode(
    intent.board,
    intent.projectName,
    prompt,
    components,
    intent.behaviors,
  );
  const steps = generateSteps(intent.board, intent.projectName, components, wires, intent.behaviors);
  const bom = generateBom(components);

  const sensorNames = components
    .filter((c) => c.component.readingVar)
    .map((c) => c.component.shortName);
  const outputNames = components
    .filter((c) => c.component.actuate || c.component.id === "oled")
    .map((c) => c.component.shortName);

  const summary = [
    `A ${board.label} build with ${components.length} component${components.length === 1 ? "" : "s"}.`,
    sensorNames.length ? `Reads: ${sensorNames.join(", ")}.` : "",
    outputNames.length ? `Drives: ${outputNames.join(", ")}.` : "",
    intent.behaviors.length
      ? intent.behaviors.map((b) => b.description).join(" ")
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    name: intent.projectName,
    board: intent.board,
    boardLabel: board.label,
    summary,
    components,
    wires,
    code,
    platformioIni,
    steps,
    bom,
    warnings,
  };
}

export async function assistantReply(prompt: string, result: BuildResult): Promise<string> {
  return aiAssistantReply(prompt, result);
}

