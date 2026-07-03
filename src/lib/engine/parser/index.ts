export { ParsingChain } from "./ParsingChain";
export type { ParsingContext, ParsingStrategy } from "./ParsingStrategy";
export { BoardDetectionStrategy } from "./BoardDetectionStrategy";
export { RecipeMatchStrategy } from "./RecipeMatchStrategy";
export { CatalogKeywordStrategy } from "./CatalogKeywordStrategy";
export { FallbackStrategy } from "./FallbackStrategy";

import { ParsingChain } from "./ParsingChain";
import { BoardDetectionStrategy } from "./BoardDetectionStrategy";
import { RecipeMatchStrategy } from "./RecipeMatchStrategy";
import { CatalogKeywordStrategy } from "./CatalogKeywordStrategy";
import { FallbackStrategy } from "./FallbackStrategy";

export function createDefaultParsingChain(): ParsingChain {
  return new ParsingChain()
    .add(new BoardDetectionStrategy())
    .add(new RecipeMatchStrategy())
    .add(new CatalogKeywordStrategy())
    .add(new FallbackStrategy());
}
