import type { Behavior, BoardId } from "../types";

export interface ParsingContext {
  raw: string;
  lower: string;
  preferredBoard?: BoardId;
  board: BoardId;
  componentIds: string[];
  behaviors: Behavior[];
  projectName: string;
  recipeName: string | null;
}

export interface ParsingStrategy {
  apply(ctx: ParsingContext): void;
}
