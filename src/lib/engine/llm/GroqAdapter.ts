import Groq from "groq-sdk";
import type { ChatCompletionOptions, ChatCompletionResult, LLMProvider } from "./LLMProvider";

const globalForGroq = globalThis as unknown as { groqInstance?: Groq };

function getGroqClient(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ_API_KEY is not set. Wirecraft requires AI to design hardware projects. " +
      "Get a free key at https://console.groq.com/keys and add it to your .env file.",
    );
  }
  if (!globalForGroq.groqInstance) {
    globalForGroq.groqInstance = new Groq({ apiKey: key });
  }
  return globalForGroq.groqInstance;
}

export class GroqAdapter implements LLMProvider {
  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResult> {
    const groq = getGroqClient();

    const chat = await groq.chat.completions.create({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature,
      max_tokens: options.max_tokens,
      response_format: options.response_format,
    });

    return {
      content: chat.choices[0]?.message?.content?.trim() ?? null,
    };
  }
}
