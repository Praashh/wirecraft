import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "~/components/landing/Nav";
import { Footer } from "~/components/landing/Footer";
import { CATALOG } from "~/lib/engine/catalog";
import { TEMPLATES } from "~/lib/engine/templates";
import { parsePrompt } from "~/lib/engine/parser";

const slugFor = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function generateStaticParams() {
  return CATALOG.map((c) => ({ slug: slugFor(c.name) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const part = CATALOG.find((c) => slugFor(c.name) === slug);
  if (!part) return { title: "Part" };
  const description = `${part.name} — pinouts, wiring notes and board compatibility for Arduino, ESP32 and Pico. Part of the Wirecraft component catalog.`;
  return {
    title: part.name,
    description,
    openGraph: {
      title: `${part.name} | Wirecraft parts`,
      description,
    },
  };
}

export default async function PartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const part = CATALOG.find((c) => slugFor(c.name) === slug);
  if (!part) notFound();

  const usedIn = TEMPLATES.filter((t) =>
    parsePrompt(t.prompt, t.board).componentIds.includes(part.id),
  ).slice(0, 4);

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <p className="eyebrow">{part.category}</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">{part.name}</h1>
        <p className="mt-3 max-w-[56ch] text-muted">{part.summary}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="card p-5">
            <h2 className="font-display text-lg font-bold">Pinout</h2>
            <ul className="mt-3 space-y-2">
              {part.pins.map((p) => (
                <li key={p.name} className="flex items-center gap-3 text-sm">
                  <span className="h-3 w-3 rounded-full border border-ink/20" style={{ background: p.color }} />
                  <span className="w-20 font-mono font-semibold">{p.name}</span>
                  <span className="text-muted">
                    {p.kind === "gnd"
                      ? "ground"
                      : p.kind === "power"
                        ? `power (${p.volts ?? 3.3} V)`
                        : p.kind.replace("i2c-sda", "I²C data").replace("i2c-scl", "I²C clock")}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card p-5">
            <h2 className="font-display text-lg font-bold">Bench notes</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{part.buildTip}</p>
            <dl className="mt-4 space-y-1.5 font-mono text-xs text-muted">
              <div className="flex justify-between">
                <dt>Typical price</dt>
                <dd className="font-semibold text-ink">${part.price.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Libraries</dt>
                <dd className="text-right">{part.libs.length ? part.libs.map((l) => l.split("@")[0]?.split("/")[1]).join(", ") : "none needed"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Prompt keywords</dt>
                <dd className="text-right">{part.keywords.slice(0, 4).join(", ")}</dd>
              </div>
            </dl>
          </section>
        </div>

        {usedIn.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold">Used in these guides</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {usedIn.map((t) => (
                <Link key={t.slug} href={`/guides/${t.slug}`} className="chip">
                  {t.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <Link
            href={`/app?prompt=${encodeURIComponent(`Build something fun with a ${part.shortName.toLowerCase()}`)}`}
            className="btn-primary"
          >
            Build with this part
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
