import Link from "next/link";
import type { BuildResult } from "~/lib/engine/types";

const slugFor = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function PartsList({ result }: { result: BuildResult }) {
  const total = result.bom.reduce((s, b) => s + b.qty * b.price, 0);
  return (
    <div className="h-full overflow-auto bg-board p-4">
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-board text-left font-mono text-xs text-muted">
              <th className="px-4 py-2.5 font-semibold">Part</th>
              <th className="px-4 py-2.5 font-semibold">Refs</th>
              <th className="px-4 py-2.5 text-right font-semibold">Qty</th>
              <th className="px-4 py-2.5 text-right font-semibold">Est.</th>
            </tr>
          </thead>
          <tbody>
            {result.bom.map((b) => (
              <tr key={b.name} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/parts/${slugFor(b.name)}`} className="font-medium hover:text-primary">
                    {b.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{b.refs.join(", ")}</td>
                <td className="px-4 py-3 text-right font-mono">{b.qty}</td>
                <td className="px-4 py-3 text-right font-mono">${(b.qty * b.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-board font-mono text-xs">
              <td className="px-4 py-2.5 text-muted" colSpan={3}>
                Plus: breadboard, jumper wires, USB cable
              </td>
              <td className="px-4 py-2.5 text-right font-semibold">≈ ${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 px-1 font-mono text-xs text-muted">
        Prices are rough hobby-market estimates. Click a part for wiring notes and specs.
      </p>
    </div>
  );
}
