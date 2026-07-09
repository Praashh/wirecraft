import type { Behavior, BoardId, BuildResult, BuildStep, PlacedComponent, WireRun } from "./types";

export class BuildResultBuilder {
  private name?: string;
  private board?: BoardId;
  private boardLabel?: string;
  private components?: PlacedComponent[];
  private wires?: WireRun[];
  private code?: string;
  private platformioIni?: string;
  private steps?: BuildStep[];
  private bom?: { name: string; qty: number; price: number; refs: string[] }[];
  private warnings?: string[];
  private behaviors?: Behavior[];

  setIdentity(name: string, board: BoardId, boardLabel: string): this {
    this.name = name;
    this.board = board;
    this.boardLabel = boardLabel;
    return this;
  }

  setAllocation(
    components: PlacedComponent[],
    wires: WireRun[],
    warnings: string[],
  ): this {
    this.components = components;
    this.wires = wires;
    this.warnings = warnings;
    return this;
  }

  setFirmware(code: string, platformioIni: string): this {
    this.code = code;
    this.platformioIni = platformioIni;
    return this;
  }

  setDocumentation(
    steps: BuildStep[],
    bom: { name: string; qty: number; price: number; refs: string[] }[],
  ): this {
    this.steps = steps;
    this.bom = bom;
    return this;
  }

  setBehaviors(behaviors: Behavior[]): this {
    this.behaviors = behaviors;
    return this;
  }

  build(): BuildResult {
    if (
      this.name === undefined ||
      this.board === undefined ||
      this.boardLabel === undefined ||
      this.components === undefined ||
      this.wires === undefined ||
      this.code === undefined ||
      this.platformioIni === undefined ||
      this.steps === undefined ||
      this.bom === undefined ||
      this.warnings === undefined
    ) {
      throw new Error("BuildResultBuilder: missing required fields");
    }

    const summary = this.generateSummary();

    return {
      name: this.name,
      board: this.board,
      boardLabel: this.boardLabel,
      summary,
      components: this.components,
      wires: this.wires,
      code: this.code,
      platformioIni: this.platformioIni,
      steps: this.steps,
      bom: this.bom,
      warnings: this.warnings,
    };
  }

  private generateSummary(): string {
    const components = this.components!;
    const behaviors = this.behaviors ?? [];

    const sensorNames = components.flatMap((c) =>
      c.component.readingVar ? [c.component.shortName] : [],
    );
    const outputNames = components.flatMap((c) =>
      c.component.actuate || c.component.id === "oled" ? [c.component.shortName] : [],
    );

    return [
      `A ${this.boardLabel} build with ${components.length} component${components.length === 1 ? "" : "s"}.`,
      sensorNames.length ? `Reads: ${sensorNames.join(", ")}.` : "",
      outputNames.length ? `Drives: ${outputNames.join(", ")}.` : "",
      behaviors.length
        ? behaviors.map((b) => b.description).join(" ")
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
}
