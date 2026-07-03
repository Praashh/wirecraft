import type { TemplateDef } from "~/lib/engine/templates";

export function Thumb({ hue, icon, seed = 3 }: { hue: number; icon: TemplateDef["icon"]; seed?: number }) {
  const bg = `hsl(${hue} 42% 92%)`;
  const mid = `hsl(${hue} 38% 78%)`;
  const deep = `hsl(${hue} 45% 34%)`;
  const wires = ["#E5484D", "#F0B100", "#2FA36B", "#2B4BF2"];

  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-hidden>
      <rect width="320" height="200" fill={bg} />
      {/* dot grid */}
      {Array.from({ length: 8 }).map((_, r) =>
        Array.from({ length: 13 }).map((__, c) => (
          <circle key={`${r}-${c}`} cx={22 + c * 23} cy={22 + r * 23} r="1.6" fill={mid} />
        )),
      )}
      {/* breadboard */}
      <g transform="translate(38 118)">
        <rect width="150" height="58" rx="8" fill="#fff" stroke={mid} />
        <rect x="10" y="8" width="130" height="4" rx="2" fill="#E5484D" opacity=".5" />
        <rect x="10" y="46" width="130" height="4" rx="2" fill="#2B4BF2" opacity=".5" />
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <circle cx={18 + i * 13} cy={24} r="1.8" fill={mid} />
            <circle cx={18 + i * 13} cy={34} r="1.8" fill={mid} />
          </g>
        ))}
      </g>
      {/* jumper wires arcing from board to glyph */}
      {wires.map((w, i) => (
        <path
          key={w}
          d={`M ${70 + i * 24} 122 C ${86 + i * 22} ${64 - i * 6}, ${176 + i * 10} ${52 + i * 8}, ${218 + i * 8} ${88 + i * 4}`}
          fill="none"
          stroke={w}
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity={0.9 - i * 0.08}
        />
      ))}
      {/* subject glyph plate */}
      <g transform="translate(196 56)">
        <rect width="96" height="96" rx="18" fill="#fff" stroke={mid} />
        <g transform="translate(48 48)" fill="none" stroke={deep} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <Glyph icon={icon} />
        </g>
      </g>
      {/* stray screw for character */}
      <circle cx={24 + (seed % 5) * 4} cy="178" r="5" fill="#fff" stroke={mid} />
      <line x1={20 + (seed % 5) * 4} y1="178" x2={28 + (seed % 5) * 4} y2="178" stroke={mid} strokeWidth="1.6" />
    </svg>
  );
}

function Glyph({ icon }: { icon: TemplateDef["icon"] }) {
  switch (icon) {
    case "plant":
      return (
        <>
          <path d="M0 26 V0" />
          <path d="M0 4 C -16 4 -22 -8 -22 -16 C -8 -16 0 -8 0 4" fill="currentColor" fillOpacity=".12" />
          <path d="M0 12 C 16 12 22 0 22 -8 C 8 -8 0 0 0 12" fill="currentColor" fillOpacity=".12" />
          <path d="M-14 26 H14" />
        </>
      );
    case "cloud":
      return (
        <>
          <path d="M-20 8 A 10 10 0 0 1 -12 -8 A 14 14 0 0 1 14 -6 A 9 9 0 0 1 16 8 Z" />
          <line x1="-10" y1="18" x2="-12" y2="26" />
          <line x1="2" y1="18" x2="0" y2="26" />
          <line x1="14" y1="18" x2="12" y2="26" />
        </>
      );
    case "car":
      return (
        <>
          <path d="M-24 8 L-20 -4 C-18 -10 -12 -12 -4 -12 L8 -12 C14 -12 18 -8 22 -2 L24 8 Z" />
          <circle cx="-12" cy="12" r="6" />
          <circle cx="12" cy="12" r="6" />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M0 -24 L20 -16 V2 C20 14 12 22 0 26 C-12 22 -20 14 -20 2 V-16 Z" />
          <path d="M-8 0 L-2 8 L10 -8" />
        </>
      );
    case "lamp":
      return (
        <>
          <path d="M-12 -6 A 12 12 0 1 1 12 -6 C 12 2 6 4 6 10 H -6 C -6 4 -12 2 -12 -6 Z" />
          <line x1="-5" y1="18" x2="5" y2="18" />
          <line x1="-4" y1="24" x2="4" y2="24" />
        </>
      );
    case "pet":
      return (
        <>
          <circle cx="0" cy="4" r="14" />
          <path d="M-13 -6 L-18 -20 L-6 -12" />
          <path d="M13 -6 L18 -20 L6 -12" />
          <circle cx="-5" cy="2" r="1.4" fill="currentColor" />
          <circle cx="5" cy="2" r="1.4" fill="currentColor" />
          <path d="M-4 10 Q0 14 4 10" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="0" cy="0" r="20" />
          <path d="M0 -10 V0 L8 6" />
        </>
      );
    case "game":
      return (
        <>
          <rect x="-22" y="-10" width="44" height="24" rx="12" />
          <line x1="-12" y1="-2" x2="-12" y2="6" />
          <line x1="-16" y1="2" x2="-8" y2="2" />
          <circle cx="10" cy="-1" r="1.6" fill="currentColor" />
          <circle cx="16" cy="5" r="1.6" fill="currentColor" />
        </>
      );
    case "music":
      return (
        <>
          <path d="M-8 14 V-14 L16 -20 V8" />
          <circle cx="-14" cy="14" r="6" />
          <circle cx="10" cy="8" r="6" />
        </>
      );
    case "chip":
      return (
        <>
          <rect x="-14" y="-14" width="28" height="28" rx="5" />
          {[-8, 0, 8].map((p) => (
            <g key={p}>
              <line x1={p} y1="-14" x2={p} y2="-22" />
              <line x1={p} y1="14" x2={p} y2="22" />
              <line x1="-14" y1={p} x2="-22" y2={p} />
              <line x1="14" y1={p} x2="22" y2={p} />
            </g>
          ))}
          <circle cx="-5" cy="-2" r="1.5" fill="currentColor" />
          <circle cx="5" cy="-2" r="1.5" fill="currentColor" />
          <path d="M-5 6 Q0 9 5 6" />
        </>
      );
    case "air":
      return (
        <>
          <path d="M-22 -8 H8 A 7 7 0 1 0 1 -15" />
          <path d="M-22 2 H16 A 7 7 0 1 1 9 9" />
          <path d="M-22 12 H0" />
        </>
      );
    case "key":
      return (
        <>
          <circle cx="-10" cy="-8" r="10" />
          <path d="M-3 -1 L18 20" />
          <path d="M10 12 L16 6" />
          <path d="M14 16 L20 10" />
        </>
      );
  }
}
