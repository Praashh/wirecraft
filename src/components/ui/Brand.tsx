export function Logo({ className = "h-[34px] w-[34px]" }: { className?: string }) {
  return (
    <div className={`grid place-items-center bg-ink text-wire-yellow rounded-lg font-display font-bold text-lg ${className}`} aria-hidden>
      W
    </div>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Logo />
      <span className="font-display text-xl font-bold tracking-tight">wirecraft</span>
    </span>
  );
}

