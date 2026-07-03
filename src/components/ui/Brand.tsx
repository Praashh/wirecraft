export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="7" fill="#17191E" />
      <path
        d="M6 22 L11 10 L16 22 L21 10 L26 22"
        fill="none"
        stroke="#F0B100"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="22" r="2.4" fill="#E5484D" />
      <circle cx="26" cy="22" r="2.4" fill="#2FA36B" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Logo />
      <span className="font-display text-lg font-bold tracking-tight">wirecraft</span>
    </span>
  );
}
