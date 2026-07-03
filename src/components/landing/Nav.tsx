"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Wordmark } from "~/components/ui/Brand";

const LINKS = [
  { href: "/guides", label: "Guides" },
  { href: "/parts", label: "Parts" },
  { href: "/blog", label: "Blog" },
  { href: "/company", label: "About" },
];

export function Banner() {
  return (
    <Link
      href="/blog"
      className="block bg-ink px-4 py-2 text-center font-mono text-xs text-white transition hover:bg-primary"
    >
      <span className="text-wire-yellow">v1.0</span> Wirecraft is now open on the workbench — firmware, wiring and build steps from a single prompt
      <span className="ml-2 inline-block rounded-pill bg-white/15 px-2 py-0.5">Read the announcement →</span>
    </Link>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-board/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Wirecraft home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-pill px-3.5 py-2 font-display text-sm font-medium text-muted transition hover:bg-surface hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <span className="font-mono text-xs text-muted">{session.user.email}</span>
              <button onClick={() => void signOut({ callbackUrl: "/" })} className="btn-ghost">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/signin" className="btn-ghost">
              Sign in
            </Link>
          )}
          <Link href="/app" className="btn-primary">
            Open the workbench
          </Link>
        </div>

        <button
          className="btn-ghost md:hidden"
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
