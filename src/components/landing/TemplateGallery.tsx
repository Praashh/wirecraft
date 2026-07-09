import Link from "next/link";
import { TEMPLATES } from "~/lib/engine/templates";

const getCategoryColor = (cat: string) => {
  const c = cat.toLowerCase();
  if (c.includes("garden")) return "#2C8C54"; // green
  if (c.includes("home") || c.includes("time") || c.includes("music") || c.includes("productivity")) return "#2F5FD0"; // blue
  if (c.includes("vehicle") || c.includes("pet") || c.includes("game")) return "#E8A020"; // gold
  return "#D9482F"; // red/orange (security, ambient, companions, adventure)
};

const getPartsCount = (slug: string) => {
  const counts: Record<string, number> = {
    "thirsty-plant-rescue": 4,
    "desk-weather-station": 5,
    "garage-parking-pal": 3,
    "doorway-watchdog": 4,
    "sunset-mood-lamp": 3,
    "midnight-night-light": 3,
    "good-dog-dispenser": 5,
    "fresh-air-sentinel": 4,
    "secret-badge-chest": 4,
    "deep-focus-timer": 5,
    "lightning-reflex-tower": 5,
    "pixel-desk-buddy": 6,
    "dawn-chorus-alarm": 5,
    "one-string-laser-band": 3,
    "porch-package-guard": 4,
    "window-farm-monitor": 4,
  };
  return counts[slug] ?? 4;
};

const getBoardLabel = (board: string) => {
  if (board === "esp32") return "ESP32";
  if (board === "arduino-uno") return "Arduino Uno";
  if (board === "pico") return "Pi Pico";
  return board;
};

export function TemplateGallery() {
  return (
    <section className="border-t border-line bg-surface py-20 px-4 sm:px-6 md:px-14" id="templates">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-11">
          <div>
            <p className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
              Templates
            </p>
            <h2 className="mt-3 font-display text-[32px] font-bold tracking-tight text-ink sm:text-[48px] leading-tight">
              Start from a working build
            </h2>
          </div>
          <Link href="/guides" className="btn-ghost self-start sm:self-auto">
            All guides
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {TEMPLATES.map((t) => {
            const color = getCategoryColor(t.category);
            return (
              <Link
                key={t.slug}
                href={`/guides/${t.slug}`}
                className="group flex flex-col justify-between bg-board border-[1.5px] border-line rounded-[14px] p-5 text-ink transition hover:border-ink hover:shadow-solid-4 hover:translate-y-[-2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-10">
                    <span
                      style={{ color, borderColor: color }}
                      className="font-mono text-[11px] font-medium tracking-[0.14em] uppercase border rounded-pill px-2.5 py-1"
                    >
                      {t.category}
                    </span>
                    <span className="font-mono text-[11px] text-[#A29A83]">
                      {getPartsCount(t.slug)} parts
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="font-display text-xl font-bold tracking-[-0.015em] mb-2 leading-snug">
                    {t.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted mb-6 min-h-[42px]">
                    {t.summary}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-dashed border-[#C9C2AE] pt-3.5 mt-auto">
                  <span className="font-mono text-xs text-[#57523F]">
                    {getBoardLabel(t.board)}
                  </span>
                  <span
                    style={{ backgroundColor: color }}
                    className="w-[34px] h-[4px] rounded-[2px]"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

