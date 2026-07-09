export function Steps() {
  return (
    <section className="border-t border-line bg-board py-20 px-4 sm:px-6 md:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#2C8C54] mb-3">
          How it works
        </p>
        <h2 className="font-display text-[32px] font-bold tracking-tight text-ink sm:text-[48px] leading-tight mb-12 max-w-[640px]">
          Three steps between an idea and a blinking LED
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <StepCard
            num="01"
            numColor="text-primary"
            n="Describe"
            body="Say it in plain language — no datasheets, no pinout tables. The parser figures out the parts, the board and the behavior."
            art={<DescribeArt />}
          />
          <StepCard
            num="02"
            numColor="text-wire-yellow"
            n="Review"
            body="Get complete firmware, a color-coded wiring diagram, a bill of materials and assembly steps. Everything is editable."
            art={<ReviewArt />}
          />
          <StepCard
            num="03"
            numColor="text-wire-green"
            n="Build"
            body="Export a ready-to-flash PlatformIO project, or copy the sketch into the Arduino IDE. Wire it up, upload, done."
            art={<BuildArt />}
          />
        </div>
      </div>
    </section>
  );
}

interface StepCardProps {
  num: string;
  numColor: string;
  n: string;
  body: string;
  art: React.ReactNode;
}

function StepCard({ num, numColor, n, body, art }: StepCardProps) {
  return (
    <article className="flex flex-col bg-surface border-[1.5px] border-line rounded-2xl overflow-hidden">
      <div className="h-[190px] border-b border-line">{art}</div>
      <div className="p-7">
        <div className="flex items-baseline gap-3 mb-3">
          <span className={`font-mono text-[13px] font-semibold ${numColor}`}>{num}</span>
          <h3 className="font-display text-2xl font-bold tracking-tight">{n}</h3>
        </div>
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#57523F]">{body}</p>
      </div>
    </article>
  );
}

function DescribeArt() {
  return (
    <div className="relative h-full w-full bg-dots p-7 flex flex-col justify-center gap-4">
      <div className="bg-surface border border-ink rounded-lg p-4 font-mono text-[13px] sm:text-[14px] leading-relaxed text-ink shadow-sm">
        make a plant waterer that pings me when soil is dry
        <span className="inline-block w-2 h-4 bg-ink align-middle ml-1 animate-pulse" />
      </div>
      <div className="flex justify-end">
        <span className="bg-ink text-board rounded-pill px-4 py-2 font-mono text-xs font-semibold">
          build it →
        </span>
      </div>
    </div>
  );
}

function ReviewArt() {
  return (
    <div className="relative h-full w-full bg-dots p-7 flex flex-col items-center justify-center gap-3.5">
      <div className="flex items-center gap-0">
        {/* mock board */}
        <div className="w-[74px] h-[96px] bg-[#2C8C54] rounded-lg grid place-items-center shadow-sm">
          <div className="w-[30px] h-[30px] bg-ink rounded" />
        </div>
        {/* mock lines */}
        <div className="flex flex-col gap-3 px-1">
          <div className="w-[90px] h-[3px] bg-wire-red rounded" />
          <div className="w-[90px] h-[3px] bg-ink rounded" />
          <div className="w-[90px] h-[3px] bg-wire-blue rounded" />
        </div>
        {/* mock component */}
        <div className="w-[54px] h-[54px] bg-surface border border-ink rounded-lg grid place-items-center shadow-sm">
          <div className="w-6 h-6 border-[3px] border-wire-blue rounded-full" />
        </div>
      </div>
      <span className="font-mono text-xs text-muted">
        3 connections · 2 parts
      </span>
    </div>
  );
}

function BuildArt() {
  return (
    <div className="relative h-full w-full bg-dots p-7 flex items-center justify-center">
      <div className="w-full bg-ink rounded-lg p-4 font-mono text-xs leading-relaxed text-board shadow-sm">
        <div className="text-wire-yellow">$ pio run --target upload</div>
        <div className="text-[#8A8471]">Compiling main.cpp ... done</div>
        <div className="text-[#8A8471]">Flashing over USB ... done</div>
        <div className="text-[#4FBF7E]">✓ Plant Waterer ready.</div>
      </div>
    </div>
  );
}

