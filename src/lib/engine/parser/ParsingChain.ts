import type { BoardId, ParsedIntent } from "../types";
import type { ParsingContext, ParsingStrategy } from "./ParsingStrategy";

export class ParsingChain {
  private strategies: ParsingStrategy[] = [];

  add(strategy: ParsingStrategy): this {
    this.strategies.push(strategy);
    return this;
  }

  execute(prompt: string, preferredBoard?: BoardId): ParsedIntent {
    const ctx: ParsingContext = {
      raw: prompt,
      lower: prompt.toLowerCase(),
      preferredBoard,
      board: preferredBoard ?? "esp32",
      componentIds: [],
      behaviors: [],
      projectName: "",
      recipeName: null,
    };

    for (const strategy of this.strategies) {
      strategy.apply(ctx);
    }

    return {
      board: ctx.board,
      componentIds: ctx.componentIds.slice(0, 6),
      projectName: ctx.projectName,
      behaviors: ctx.behaviors,
    };
  }
}
