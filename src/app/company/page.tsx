import type { Metadata } from "next";
import { Nav } from "~/components/landing/Nav";
import { Footer } from "~/components/landing/Footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Wirecraft is an open, local-first hardware workbench. Learn about the project, our privacy stance, and how to contribute.",
  openGraph: {
    title: "About | Wirecraft",
    description: "Learn about Wirecraft — the open, local-first hardware workbench for makers.",
  },
};

export default function CompanyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
          Hardware should be a weekend, not a semester
        </h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted">
          <p>
            Wirecraft exists because the distance between &ldquo;I have an idea&rdquo; and
            &ldquo;an LED is blinking&rdquo; is mostly friction: datasheets, pinout tables,
            library incompatibilities and the quiet fear of letting the smoke out. Software
            got REPLs and hot reload; hardware got a 40-tab browser session.
          </p>
          <p>
            The workbench collapses that distance. Describe the gadget. Get the firmware, the
            wiring, the shopping list and the steps — all generated from one model of your build,
            so they can never disagree with each other. Then iterate in plain language until it
            does what you imagined.
          </p>
          <p>
            It is open, local-first and free. The build engine runs in your own process; your
            projects live in your own database file. Fork it, extend the parts catalog, teach it
            new boards.
          </p>
        </div>

        <section id="jobs" className="card mt-10 p-6">
          <h2 className="font-display text-xl font-bold">Jobs</h2>
          <p className="mt-2 text-sm text-muted">
            Wirecraft is a community project rather than a company — the &ldquo;openings&rdquo; are
            good first issues. Extending the component catalog, adding a new board profile, or
            improving the diagram layout are all welcome contributions.
          </p>
        </section>

        <section id="privacy" className="card mt-4 p-6">
          <h2 className="font-display text-xl font-bold">Privacy</h2>
          <p className="mt-2 text-sm text-muted">
            Self-hosted Wirecraft sends nothing anywhere. Prompts, projects and accounts stay in
            your local SQLite database. If you enable the optional Ollama integration, prompts go
            to the local model you configured — still on your machine.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
