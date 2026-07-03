export type { LLMProvider, ChatMessage, ChatCompletionOptions, ChatCompletionResult } from "./LLMProvider";
export { GroqAdapter } from "./GroqAdapter";

import type { LLMProvider } from "./LLMProvider";
import { GroqAdapter } from "./GroqAdapter";

let _provider: LLMProvider | null = null;

export function getLLMProvider(): LLMProvider {
  if (!_provider) {
    _provider = new GroqAdapter();
  }
  return _provider;
}
