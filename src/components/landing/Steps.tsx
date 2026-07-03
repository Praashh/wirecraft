export function Steps() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-2 max-w-[22ch] font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps between an idea and a blinking LED
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <StepCard
            n="Describe"
            body="Say it in plain language — no datasheets, no pinout tables. The parser figures out the parts, the board and the behavior."
            art={<DescribeArt />}
          />
          <StepCard
            n="Review"
            body="Get complete firmware, a color-coded wiring diagram, a bill of materials and assembly steps. Everything is editable."
            art={<ReviewArt />}
          />
          <StepCard
            n="Build"
            body="Export a ready-to-flash PlatformIO project, or copy the sketch into the Arduino IDE. Wire it up, upload, done."
            art={<BuildArt />}
          />
        </div>
      </div>
    </section>
  );
}

function StepCard({ n, body, art }: { n: string; body: string; art: React.ReactNode }) {
  return (
    <article className="card overflow-hidden">
      <div className="aspect-[16/10] border-b border-line bg-board">{art}</div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold">{n}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </article>
  );
}

function DescribeArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill="#F2F1EC" />
      <rect x="36" y="52" width="248" height="64" rx="14" fill="#fff" stroke="#E3E1D9" />
      <text x="52" y="80" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#17191E">
        make a plant waterer that
      </text>
      <text x="52" y="98" fontFamily="JetBrains Mono, monospace" fontSize="12" fill="#17191E">
        pings me when soil is dry▊
      </text>
      <rect x="204" y="126" width="80" height="26" rx="13" fill="#17191E" />
      <text x="218" y="143" fontFamily="Space Grotesk, sans-serif" fontSize="11" fill="#fff">
        build it →
      </text>
      <circle cx="52" cy="152" r="4" fill="#E5484D" />
      <circle cx="66" cy="152" r="4" fill="#F0B100" />
      <circle cx="80" cy="152" r="4" fill="#2FA36B" />
    </svg>
  );
}

function ReviewArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill="#F2F1EC" />
      {/* mini board */}
      <rect x="30" y="60" width="72" height="96" rx="8" fill="#1D5C3F" />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <circle cx="38" cy={72 + i * 12} r="2.4" fill="#F0B100" />
          <circle cx="94" cy={72 + i * 12} r="2.4" fill="#F0B100" />
        </g>
      ))}
      <rect x="48" y="92" width="36" height="32" rx="4" fill="#17191E" />
      {/* component */}
      <rect x="222" y="76" width="68" height="52" rx="8" fill="#fff" stroke="#E3E1D9" />
      <circle cx="256" cy="102" r="14" fill="none" stroke="#2B4BF2" strokeWidth="3" />
      {/* wires */}
      <path d="M94 84 C 150 60, 190 66, 224 86" fill="none" stroke="#E5484D" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M94 108 C 150 96, 186 96, 224 102" fill="none" stroke="#2FA36B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M94 132 C 150 140, 186 130, 224 116" fill="none" stroke="#17191E" strokeWidth="3.5" strokeLinecap="round" />
      <text x="120" y="170" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#6B6E76">
        3 connections · 2 parts
      </text>
    </svg>
  );
}

function BuildArt() {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" aria-hidden>
      <rect width="320" height="200" fill="#F2F1EC" />
      <rect x="40" y="48" width="240" height="104" rx="10" fill="#17191E" />
      <text x="56" y="76" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#2FA36B">
        $ pio run --target upload
      </text>
      <text x="56" y="96" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#B9BCC4">
        Compiling main.cpp ... done
      </text>
      <text x="56" y="116" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#B9BCC4">
        Flashing over USB ... done
      </text>
      <text x="56" y="136" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#F0B100">
        ✓ Plant Waterer ready.
      </text>
      <circle cx="268" cy="64" r="5" fill="#2FA36B">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
