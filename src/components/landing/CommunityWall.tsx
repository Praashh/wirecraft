const POSTS: { name: string; handle: string; text: string; color: string }[] = [
  { name: "Priya", handle: "@priya_makes", text: "My monstera got its own pump last night. Soil probe → relay → tiny fountain of life. Total bench time: 40 minutes.", color: "#2C8C54" },
  { name: "Jonas", handle: "@jonas_solders", text: "The wiring diagram alone is worth it. Color-coded jumpers meant zero magic smoke on the first power-up. A personal record.", color: "#2F5FD0" },
  { name: "Mika", handle: "@mika_builds", text: "Built the parking pal for my dad's garage. He reversed in, it beeped, he saluted the breadboard. Mission accomplished.", color: "#A0622D" },
  { name: "Sofía", handle: "@sofia_volts", text: "Kid presented their RFID badge, the chest clicked open, absolute chaos of joy. Best birthday build yet.", color: "#A02D6E" },
  { name: "Ravi", handle: "@ravi_prototypes", text: "Went from 'I should learn microcontrollers' to a working focus timer on a Pico in one evening. The exported PlatformIO project just… flashed.", color: "#2F5FD0" },
  { name: "Anna", handle: "@anna_onthebench", text: "The desk buddy's OLED face judges me when I skip breaks. I built my own accountability. No regrets. Some regrets.", color: "#2C8C54" },
  { name: "Theo", handle: "@theo_tinkers", text: "Swapped the Uno for an ESP32 mid-chat and it re-allocated every pin without complaint. That's the feature, honestly.", color: "#D9482F" },
  { name: "Lena", handle: "@lena_ledlab", text: "Night light fades on at dusk exactly like the steps promised. My hallway has never been this smug.", color: "#2F5FD0" },
];

export function CommunityWall() {
  return (
    <section className="border-t border-line bg-surface py-20 px-4 sm:px-6 md:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#2F5FD0] mb-3">
          From the bench
        </p>
        <h2 className="font-display text-[32px] font-bold tracking-tight text-ink sm:text-[48px] leading-tight mb-2">
          What people are building
        </h2>
        <p className="font-mono text-sm text-muted mb-11">
          Sample posts — swap in your own community feed when you deploy.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POSTS.map((p, i) => (
            <article
              key={i}
              className="flex flex-col gap-4 bg-board border-[1.5px] border-line rounded-[14px] p-6 text-ink"
            >
              <div className="flex items-center gap-3">
                <span
                  style={{ backgroundColor: p.color }}
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-full font-display text-[17px] font-bold text-board"
                >
                  {p.name[0]}
                </span>
                <div>
                  <p className="font-display font-semibold text-[15px] leading-none text-ink">{p.name}</p>
                  <p className="mt-1 font-mono text-xs text-[#7A745F] leading-none">{p.handle}</p>
                </div>
              </div>
              <p className="text-sm sm:text-[15px] leading-relaxed text-[#3E3A2C]">{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

