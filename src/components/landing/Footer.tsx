import Link from "next/link";
import { Wordmark } from "~/components/ui/Brand";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Home" },
      { href: "/app", label: "Open the workbench" },
      { href: "/guides", label: "Templates" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/guides", label: "Build guides" },
      { href: "/parts", label: "Parts library" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Boards",
    links: [
      { href: "/app?board=arduino-uno", label: "Arduino Uno" },
      { href: "/app?board=esp32", label: "ESP32" },
      { href: "/app?board=pico", label: "Raspberry Pi Pico" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/company#jobs", label: "Jobs" },
      { href: "/company#privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_repeat(4,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-[24ch] text-sm text-muted">
              Built on the kitchen table. For everyone with a drawer full of jumper wires.
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-ink transition hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="wire-underline mt-16 inline-block font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
          solder less.
          <br />
          build more.
        </p>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-line pt-6 font-mono text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Wirecraft — MIT licensed, fork away</span>
          <span>No cloud required · No paid APIs · Your bench, your rules</span>
        </div>
      </div>
    </footer>
  );
}
