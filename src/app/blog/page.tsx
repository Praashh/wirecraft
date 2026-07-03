import type { Metadata } from "next";
import { Nav } from "~/components/landing/Nav";
import { Footer } from "~/components/landing/Footer";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the bench — engineering deep-dives, release announcements and behind-the-scenes of the Wirecraft hardware workbench.",
  openGraph: {
    title: "Blog | Wirecraft",
    description: "Engineering deep-dives and release notes from the Wirecraft team.",
  },
};

const POSTS = [
  {
    date: "2026-06-30",
    title: "Wirecraft 1.0: a workbench that fits in a repo",
    body: "Today we're shipping version 1.0 — a self-hostable hardware workbench that turns a plain-language prompt into firmware, a wiring diagram, a parts list and assembly steps. The build engine is fully deterministic and runs in your own Node process: no cloud calls, no API keys, no metering. Optionally, point it at a local Ollama model for chattier replies. Everything else — the parser, the pin allocator, the code generator — is transparent TypeScript you can read and extend.",
  },
  {
    date: "2026-06-12",
    title: "How the pin allocator avoids frying your afternoon",
    body: "Every board speaks a slightly different dialect of 'digital pin'. The allocator models each board's pins as capability sets (digital, PWM, analog, I²C) and walks your component list assigning the most specific free pin first. Analog sensors grab true ADC pins before anything else can squat on them; PWM devices settle for plain digital only when the good pins are gone. If a build genuinely doesn't fit, the engine drops the component and tells you — rather than silently wiring a servo to an input-only pin.",
  },
  {
    date: "2026-05-28",
    title: "Why we generate diagrams instead of drawing them",
    body: "Hand-drawn wiring diagrams age badly: swap one component and the whole picture is wrong. Ours are pure functions of the build — the same data that produces the firmware produces the SVG, so the picture is never out of sync with the code. Color is meaning here: red is power, black is ground, and every signal wire matches the pin dot it lands on.",
  },
];

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Notes from the bench</h1>
        <div className="mt-10 space-y-10">
          {POSTS.map((p) => (
            <article key={p.title} className="card p-6">
              <time className="font-mono text-xs text-muted">{p.date}</time>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{p.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{p.body}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
