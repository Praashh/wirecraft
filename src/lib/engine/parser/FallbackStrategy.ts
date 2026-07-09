import type { ParsingContext, ParsingStrategy } from "./ParsingStrategy";

function titleCase(s: string) {
  return s.replace(/\b\w/g, (m) => m.toUpperCase());
}

export class FallbackStrategy implements ParsingStrategy {
  apply(ctx: ParsingContext): void {
    if (ctx.componentIds.length === 0) {
      ctx.componentIds.push("led", "button");
    }

    const idSet = new Set(ctx.componentIds);
    ctx.behaviors = ctx.behaviors.filter(
      (b) => idSet.has(b.sensorId) && idSet.has(b.actuatorId),
    );

    ctx.projectName = ctx.recipeName
      ? ctx.recipeName
      : titleCase(
          ctx.raw
            .replace(/[^a-z0-9 ]/gi, "")
            .split(/\s+/)
            .slice(0, 4)
            .join(" "),
        ) || "Starter Blink";
  }
}
