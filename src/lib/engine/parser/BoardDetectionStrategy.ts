import type { BoardId } from "../types";
import type { ParsingContext, ParsingStrategy } from "./ParsingStrategy";
import { hasKw } from "./utils";

const BOARD_HINTS: [string[], BoardId][] = [
  [["esp32", "esp-32", "wifi", "wi-fi", "bluetooth", "iot"], "esp32"],
  [["pico", "rp2040", "raspberry pi pico"], "pico"],
  [["uno", "arduino", "atmega"], "arduino-uno"],
];

export class BoardDetectionStrategy implements ParsingStrategy {
  apply(ctx: ParsingContext): void {
    if (ctx.preferredBoard) {
      ctx.board = ctx.preferredBoard;
      return;
    }

    for (const [hints, id] of BOARD_HINTS) {
      if (hints.some((h) => hasKw(ctx.lower, h))) {
        ctx.board = id;
        return;
      }
    }
  }
}
