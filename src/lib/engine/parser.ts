import type { BoardId, ParsedIntent } from "./types";
import { createDefaultParsingChain } from "./parser/index";

const chain = createDefaultParsingChain();

export function parsePrompt(prompt: string, preferredBoard?: BoardId): ParsedIntent {
  return chain.execute(prompt, preferredBoard);
}
