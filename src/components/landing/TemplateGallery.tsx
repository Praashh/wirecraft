import Link from "next/link";
import { TEMPLATES } from "~/lib/engine/templates";
import { Thumb } from "~/components/ui/Thumb";

export function TemplateGallery() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" id="templates">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Templates</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Start from a working build
          </h2>
        </div>
        <Link href="/guides" className="btn-ghost hidden sm:inline-flex">
          All guides
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {TEMPLATES.map((t, i) => (
          <Link
            key={t.slug}
            href={`/guides/${t.slug}`}
            className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            <div className="aspect-[16/10] overflow-hidden border-b border-line">
              <div className="h-full w-full transition duration-300 group-hover:scale-[1.03]">
                <Thumb hue={t.hue} icon={t.icon} seed={i} />
              </div>
            </div>
            <div className="p-3.5">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                {t.category}
              </p>
              <h3 className="mt-1 font-display text-sm font-semibold leading-snug">{t.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/guides" className="btn-ghost mt-6 w-full justify-center sm:hidden">
        All guides
      </Link>
    </section>
  );
}
