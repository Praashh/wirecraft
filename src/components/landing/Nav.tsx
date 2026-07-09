"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Wordmark } from "~/components/ui/Brand";

const LINKS = [
  { href: "/guides", label: "Guides" },
  { href: "/parts", label: "Parts" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Banner() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1.5 bg-ink px-6 py-2.5 text-center font-mono text-xs text-board">
      <span className="text-wire-yellow font-bold">v1.0</span>
      <span className="opacity-85">
        Wirecraft is now open on the workbench — firmware, wiring and build steps from a single prompt
      </span>
      <Link
        href="/blog"
        className="rounded-pill border border-[#4A463C] px-3 py-1 text-[11px] text-board transition hover:border-wire-yellow hover:text-wire-yellow"
      >
        Read the announcement →
      </Link>
    </div>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-board/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" aria-label="Wirecraft home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-sm font-medium text-ink transition hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="font-mono text-xs text-muted">{session.user.email}</span>
              <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="btn-ghost !px-5 !py-2.5 text-sm font-semibold">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="btn-ghost !px-5 !py-2.5 text-sm font-semibold">
              Sign in
            </Link>
          )}
          <Link href="/app" className="btn-primary !px-5 !py-2.5 text-sm font-semibold">
            Open the workbench
          </Link>
        </div>

        <button
          type="button"
          className="btn-ghost md:hidden !px-3.5 !py-1.5"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>


      {open && (
        <nav className="border-t border-line bg-surface px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 font-display font-medium text-ink hover:bg-board"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/app" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
              Open the workbench
            </Link>
            {!session && (
              <Link href="/signin" onClick={() => setOpen(false)} className="btn-ghost mt-1 justify-center">
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
