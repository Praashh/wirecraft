const POSTS: { name: string; handle: string; text: string; hue: number }[] = [
  { name: "Priya", handle: "@priya_makes", text: "My monstera got its own pump last night. Soil probe → relay → tiny fountain of life. Total bench time: 40 minutes.", hue: 145 },
  { name: "Jonas", handle: "@jonas_solders", text: "The wiring diagram alone is worth it. Color-coded jumpers meant zero magic smoke on the first power-up. A personal record.", hue: 210 },
  { name: "Mika", handle: "@mika_builds", text: "Built the parking pal for my dad's garage. He reversed in, it beeped, he saluted the breadboard. Mission accomplished.", hue: 28 },
  { name: "Sofía", handle: "@sofia_volts", text: "Kid presented their RFID badge, the chest clicked open, absolute chaos of joy. Best birthday build yet.", hue: 320 },
  { name: "Ravi", handle: "@ravi_prototypes", text: "Went from 'I should learn microcontrollers' to a working focus timer on a Pico in one evening. The exported PlatformIO project just… flashed.", hue: 200 },
  { name: "Anna", handle: "@anna_onthebench", text: "The desk buddy's OLED face judges me when I skip breaks. I built my own accountability. No regrets. Some regrets.", hue: 165 },
  { name: "Theo", handle: "@theo_tinkers", text: "Swapped the Uno for an ESP32 mid-chat and it re-allocated every pin without complaint. That's the feature, honestly.", hue: 5 },
  { name: "Lena", handle: "@lena_ledlab", text: "Night light fades on at dusk exactly like the steps promised. My hallway has never been this smug.", hue: 245 },
];

export function CommunityWall() {
  const doubled = [...POSTS, ...POSTS];
  return (
    <section className="overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">From the bench</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          What people are building
        </h2>
        <p className="mt-2 font-mono text-xs text-muted">
          Sample posts — swap in your own community feed when you deploy.
        </p>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-board to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-board to-transparent" />
        <div className="marquee flex w-max gap-4 pr-4">
          {doubled.map((p, i) => (
            <article key={i} className="card w-[300px] shrink-0 p-4" aria-hidden={i >= POSTS.length}>
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                  style={{ background: `hsl(${p.hue} 45% 42%)` }}
                >
                  {p.name[0]}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold leading-none">{p.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">{p.handle}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
