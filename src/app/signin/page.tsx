"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { api } from "~/trpc/client";
import { Wordmark } from "~/components/ui/Brand";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const register = api.user.register.useMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "register") {
        await register.mutateAsync({ name, email, password });
      }
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("That email and password don't match an account.");
      } else {
        router.push("/app");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-dots bg-board px-4">
      <div className="card w-full max-w-sm p-6">
        <Link href="/" className="inline-block">
          <Wordmark />
        </Link>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
          {mode === "signin" ? "Back to the bench" : "Claim a spot on the bench"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "signin"
            ? "Sign in to keep your builds across devices."
            : "An account keeps your builds — guest projects made on this device come with you."}
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === "register" && (
            <Field label="Name" type="text" value={name} onChange={setName} autoComplete="name" />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            hint={mode === "register" ? "8+ characters" : undefined}
          />
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-wire-red">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">
            {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "signin" ? "register" : "signin"));
            setError(null);
          }}
          className="mt-4 w-full text-center font-mono text-xs text-muted hover:text-ink"
        >
          {mode === "signin" ? "New here? Create an account →" : "Already have an account? Sign in →"}
        </button>

        <Link href="/app" className="mt-2 block w-full text-center font-mono text-xs text-muted hover:text-ink">
          Or keep building as a guest →
        </Link>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs font-semibold text-muted">
        {props.label}
        {props.hint && <span className="ml-1 font-normal">({props.hint})</span>}
      </span>
      <input
        type={props.type}
        value={props.value}
        required
        minLength={props.type === "password" ? 8 : 1}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-line bg-board px-3.5 py-2.5 text-sm outline-none focus:border-ink"
      />
    </label>
  );
}
