import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "~/components/landing/Nav";
import { Footer } from "~/components/landing/Footer";
import { Thumb } from "~/components/ui/Thumb";
import { WiringDiagram } from "~/components/ide/WiringDiagram";
import { CodeView } from "~/components/ide/CodeView";
import { PartsList } from "~/components/ide/PartsList";
import { StepsView } from "~/components/ide/StepsView";
import { buildProject } from "~/lib/engine/engine";
import { TEMPLATES, templateBySlug } from "~/lib/engine/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = templateBySlug((await params).slug);
  if (!t) return { title: "Guide" };
  const description = `Step-by-step build guide for "${t.title}" — wiring diagram, firmware, parts list and assembly instructions for ${t.board ?? "your board"}.`;
  return {
    title: t.title,
    description,
    openGraph: {
      title: `${t.title} | Wirecraft guides`,
      description,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const t = templateBySlug((await params).slug);
  if (!t) notFound();

  const result = await buildProject(t.prompt, t.board, { offline: true });

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">
              {t.category} · {result.boardLabel}
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">{t.title}</h1>
            <p className="mt-3 max-w-[50ch] text-muted">{result.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/app?board=${t.board}&prompt=${encodeURIComponent(t.prompt)}`}
                className="btn-primary"
              >
                Open in the workbench
              </Link>
              <a href="#code" className="btn-ghost">
                Jump to code
              </a>
            </div>
            <p className="mt-4 font-mono text-xs text-muted">
              {result.bom.length} parts · {result.wires.length} connections · {result.steps.length} steps
            </p>
          </div>
          <div className="card overflow-hidden">
            <div className="aspect-[16/10]">
              <Thumb hue={t.hue} icon={t.icon} />
            </div>
          </div>
        </div>

        <Section title="Wiring">
          <div className="card overflow-hidden h-[400px] sm:h-[480px]">
            <WiringDiagram result={result} />
          </div>
        </Section>

        <Section title="Parts">
          <PartsList result={result} />
        </Section>

        <Section title="Firmware" id="code">
          <CodeView result={result} />
        </Section>

        <Section title="Assembly">
          <StepsView result={result} />
        </Section>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
