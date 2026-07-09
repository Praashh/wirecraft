import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "~/components/landing/Nav";
import { Footer } from "~/components/landing/Footer";
import { CATALOG } from "~/lib/engine/catalog";
import { BOARDS, BOARD_ORDER } from "~/lib/engine/boards";

export const metadata: Metadata = {
  title: "Parts library",
  description:
    "Browse every sensor, actuator and display supported by Wirecraft — with pinouts, wiring notes and board compatibility for Arduino, ESP32 and Pico.",
  openGraph: {
    title: "Parts library | Wirecraft",
    description: "Every sensor, actuator and display supported by Wirecraft — with pinouts and compatibility info.",
  },
};

const slugFor = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function PartsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.toLowerCase() ?? "";
  const active = params.category;
  const categories = [...new Set(CATALOG.map((c) => c.category))].sort();

  const shown = CATALOG.filter(
    (c) =>
      (!q || c.name.toLowerCase().includes(q) || c.keywords.some((k) => k.includes(q))) &&
      (!active || c.category === active),
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="eyebrow">Parts</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Parts library</h1>
        <p className="mt-2 max-w-[52ch] text-muted">
          Every component the build engine knows how to wire and program. Mention any of these in a
          prompt and it lands on your breadboard.
        </p>

        <form className="mt-6 flex flex-wrap items-center gap-2" action="/parts">
          <input
            type="search"
            name="q"
            defaultValue={params.q}
            placeholder="Search parts — e.g. servo, motion, display"
            className="w-full max-w-sm rounded-pill border border-line bg-surface px-4 py-2.5 text-sm outline-none focus:border-ink"
            aria-label="Search parts"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/parts" className={`chip ${!active ? "chip-active" : ""}`}>
            All
          </Link>
          {categories.map((c) => (
            <Link key={c} href={`/parts?category=${encodeURIComponent(c)}`} className={`chip ${active === c ? "chip-active" : ""}`}>
              {c}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <Link key={c.id} href={`/parts/${slugFor(c.name)}`} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">{c.category}</p>
                  <h2 className="mt-1 font-display text-base font-semibold leading-snug">{c.name}</h2>
                </div>
                <span className="rounded-pill bg-primary-soft px-2.5 py-1 font-mono text-xs font-semibold text-primary">
                  ${c.price.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{c.summary}</p>
              <p className="mt-3 font-mono text-[11px] text-muted">
                {c.pins.length} pins · works with{" "}
                {BOARD_ORDER.map((b) => BOARDS[b].svg.name).join(" / ")}
              </p>
            </Link>
          ))}
          {shown.length === 0 && (
            <p className="col-span-full rounded-card border border-dashed border-line p-8 text-center text-sm text-muted">
              No parts match that search. Try a broader word like &ldquo;sensor&rdquo; or &ldquo;light&rdquo;.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
