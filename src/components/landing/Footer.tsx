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
    title: "Project",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#privacy", label: "Privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-board py-20 px-4 sm:px-6 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(4,1fr)] mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {/* Logo block customized for dark footer background */}
              <div className="grid place-items-center bg-wire-yellow text-ink rounded-lg font-display font-bold text-lg w-[34px] h-[34px]">
                W
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-board">wirecraft</span>
            </div>
            <p className="max-w-[260px] text-sm leading-relaxed text-[#A29A83]">
              Built on the kitchen table. For everyone with a drawer full of jumper wires.
            </p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="flex flex-col gap-4.5">
              <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-[#7A745F]">
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#D9D2BF] transition hover:text-wire-yellow"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Large Slogan Section */}
        <div className="mb-16">
          <div className="font-display text-[56px] font-bold leading-[1.02] tracking-[-0.035em] sm:text-[96px] text-board">
            solder less.
            <br />
            build more.
          </div>
          <div className="mt-6 flex h-[6px] w-full max-w-[560px] overflow-hidden rounded-[3px]">
            <div className="flex-1 bg-wire-red" />
            <div className="flex-1 bg-wire-yellow" />
            <div className="flex-1 bg-wire-green" />
            <div className="flex-1 bg-wire-blue" />
          </div>
        </div>

        {/* Bottom copyright segment */}
        <div className="flex flex-col justify-between gap-4 border-t border-[#33302A] pt-7 font-mono text-[13px] text-[#7A745F] sm:flex-row">
          <span>© {new Date().getFullYear()} Wirecraft — MIT licensed, fork away</span>
          <span>No cloud required · No paid APIs · Your bench, your rules</span>
        </div>
      </div>
    </footer>
  );
}
