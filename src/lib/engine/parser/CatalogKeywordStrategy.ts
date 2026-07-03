import { CATALOG } from "../catalog";
import type { ParsingContext, ParsingStrategy } from "./ParsingStrategy";
import { hasKw } from "./utils";

export class CatalogKeywordStrategy implements ParsingStrategy {
  apply(ctx: ParsingContext): void {
    for (const c of CATALOG) {
      if (c.keywords.some((k) => hasKw(ctx.lower, k)) && !ctx.componentIds.includes(c.id)) {
        ctx.componentIds.push(c.id);
      }
    }
  }
}
