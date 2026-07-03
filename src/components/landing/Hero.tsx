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
    <section className="relative overflow-hidden bg-dots bg-dots">
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Choose your board">
          {BOARD_ORDER.map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={board === id}
              onClick={() => setBoard(id)}
              className={`chip ${board === id ? "chip-active" : ""}`}
            >
              {BOARDS[id].label}
            </button>
          ))}
        </div>

        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Describe it.
          <br />
          <span className="wire-underline">Wire it. Flash it.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-base text-muted sm:text-lg">
          Tell the workbench what you want to build. Get firmware, a wiring diagram, a
          parts list and step-by-step assembly — from idea to blinking hardware in one sitting.
        </p>

        <div className="card mx-auto mt-8 max-w-2xl p-2 text-left shadow-pop">
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
            className="w-full resize-none rounded-xl bg-transparent px-4 py-3 font-body text-base outline-none placeholder:text-muted/70"
          />
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="font-mono text-[11px] text-muted">
              target: <span className="text-ink">{BOARDS[board].label}</span>
            </span>
            <button onClick={go} className="btn-primary">
              Start building
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 8h11M9 3.5 13.5 8 9 12.5" />
              </svg>
            </button>
          </div>
        </div>

        <p className="mt-4 font-mono text-xs text-muted">
          Free forever · Runs a deterministic build engine — no cloud, no API keys
        </p>
      </div>
    </section>
  );
}
