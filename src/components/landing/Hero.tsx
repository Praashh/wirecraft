"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BOARDS, BOARD_ORDER } from "~/lib/engine/boards";
import type { BoardId } from "~/lib/engine/types";

const IDEAS = [
  "a plant waterer that texts me when the soil is dry",
  "a parking sensor that beeps when I'm 30 cm from the wall",
  "a desk buddy with an OLED face and moods",
  "an RFID treasure chest for my kid's birthday",
  "a night light that fades on at dusk",
];

export function Hero() {
  const router = useRouter();
  const [board, setBoard] = useState<BoardId>("esp32");
  const [prompt, setPrompt] = useState("");
  const [ideaIx, setIdeaIx] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setInterval(() => setIdeaIx((i) => (i + 1) % IDEAS.length), 3400);
    return () => clearInterval(t);
  }, []);

  const go = () => {
    const q = prompt.trim() || IDEAS[ideaIx]!;
    router.push(`/app?board=${board}&prompt=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative overflow-hidden bg-dots px-4 pb-24 pt-20 text-center sm:px-6">
      <div className="mx-auto max-w-3xl flex flex-col items-center">
        {/* Board Tablist */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2.5" role="tablist" aria-label="Choose your board">
          {BOARD_ORDER.map((id) => (
            <button
              type="button"
              key={id}
              role="tab"
              aria-selected={board === id}
              onClick={() => setBoard(id)}
              className={`rounded-pill px-4 py-2 font-mono text-[13px] transition border-[1.5px] ${board === id
                ? "bg-ink border-ink text-board"
                : "bg-surface border-[#C9C2AE] text-ink hover:border-ink"
                }`}
            >
              {BOARDS[id].label}
            </button>
          ))}
        </div>

        {/* Big Heading */}
        <h1 className="font-display text-[52px] font-bold leading-[1.0] tracking-[-0.035em] text-ink sm:text-[92px]">
          Describe it.
          <br />
          Wire it. <span className="text-primary">Build it.</span>
        </h1>

        {/* Divider bar */}

        {/* Sub-paragraph */}
        <p className="mb-12 mt-5 max-w-[620px] text-lg sm:text-[20px] leading-[1.6] text-[#57523F] text-pretty">
          Tell the workbench what you want to build. Get firmware, a wiring diagram, a
          parts list and step-by-step assembly from idea to blinking hardware in one sitting.
        </p>

        {/* Prompt Card */}
        <div className="w-full max-w-[760px] bg-surface border-[1.5px] border-ink rounded-2xl shadow-solid-6 text-left overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center gap-2 px-[18px] py-3 border-b border-line bg-surface/50">
            <span className="w-2.5 h-2.5 rounded-full bg-wire-red" />
            <span className="w-2.5 h-2.5 rounded-full bg-wire-yellow" />
            <span className="w-2.5 h-2.5 rounded-full bg-wire-green" />
            <span className="ml-auto font-mono text-xs text-[#A29A83]">new-build.wire</span>
          </div>

          <label htmlFor="hero-prompt" className="sr-only">
            Describe your build
          </label>
          <textarea
            id="hero-prompt"
            ref={inputRef}
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                go();
              }
            }}
            placeholder={`e.g. ${IDEAS[ideaIx]}`}
            className="w-full resize-none bg-transparent px-6 py-6 font-mono text-base sm:text-[17px] leading-relaxed outline-none placeholder:text-[#A29A83]"
          />

          {/* Action Row */}
          <div className="flex items-center justify-between px-6 pb-5 pt-4">
            <span className="font-mono text-xs sm:text-[13px] text-[#57523F]">
              target: <strong className="text-ink">{BOARDS[board].label}</strong>
            </span>
            <button
              type="button"
              onClick={go}
              className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3 font-display text-sm sm:text-base font-semibold text-board transition hover:opacity-[0.88] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Start building →
            </button>
          </div>
        </div>

        <p className="mt-7 font-mono text-[13px] text-muted">
          Free forever · Runs a deterministic build engine — no cloud, no API keys
        </p>
      </div>
    </section>
  );
}
