export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionOptions {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
}

export interface ChatCompletionResult {
  content: string | null;
}

export interface LLMProvider {
  chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult>;
}
