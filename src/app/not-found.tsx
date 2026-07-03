import Link from "next/link";
import { Wordmark } from "~/components/ui/Brand";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-dots bg-board px-4 text-center">
      <Wordmark />
      <h1 className="font-display text-5xl font-bold tracking-tight">404</h1>
      <p className="max-w-[36ch] text-muted">
        This pin isn&rsquo;t connected to anything. Check the wiring — or head back to the bench.
      </p>
      <Link href="/" className="btn-primary">Back home</Link>
    </main>
  );
}
