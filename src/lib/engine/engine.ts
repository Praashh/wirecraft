import { allocate } from "./allocator";
import { aiAssistantReply, aiParsePrompt } from "./ai";
import { BOARDS } from "./boards";
import { BuildResultBuilder } from "./BuildResultBuilder";
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

  return new BuildResultBuilder()
    .setIdentity(intent.projectName, intent.board, board.label)
    .setAllocation(components, wires, warnings)
    .setFirmware(code, platformioIni)
    .setDocumentation(steps, bom)
    .setBehaviors(intent.behaviors)
    .build();
}

export async function assistantReply(prompt: string, result: BuildResult): Promise<string> {
  return aiAssistantReply(prompt, result);
}
