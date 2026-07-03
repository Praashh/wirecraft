import { byId } from "./catalog";
import type { AllocatedPin, CatalogComponent, PlacedComponent, WireRun } from "./types";

export class ComponentFactory {
  private counts = new Map<string, number>();

  getCatalogComponent(id: string): CatalogComponent {
    return byId(id);
  }

  createPlacedComponent(
    id: string,
    comp: CatalogComponent,
    pins: AllocatedPin[],
  ): { placed: PlacedComponent; wires: WireRun[] } {
    const n = (this.counts.get(id) ?? 0) + 1;
    this.counts.set(id, n);

    const refName = this.buildRefName(comp.shortName, n);

    const placed: PlacedComponent = {
      component: comp,
      instance: n,
      refName,
      pins,
    };

    const wires: WireRun[] = pins.map((pin) => ({
      fromBoardPin: pin.boardPin,
      toComponent: refName,
      toPin: pin.name,
      color: pin.color,
      kind: pin.kind,
    }));

    return { placed, wires };
  }

  getInstanceCount(id: string): number {
    return this.counts.get(id) ?? 0;
  }

  private buildRefName(shortName: string, instance: number): string {
    const base = shortName
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((w) => w[0]!.toUpperCase() + w.slice(1))
      .join("");
    return `${base}${instance > 1 ? `_${instance}` : ""}`;
  }
}
