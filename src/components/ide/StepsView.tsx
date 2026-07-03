import type { BuildResult } from "~/lib/engine/types";

export function StepsView({ result }: { result: BuildResult }) {
  return (
    <div className="h-full overflow-auto bg-board p-4">
      <ol className="space-y-3">
        {result.steps.map((s, i) => (
          <li key={i} className="card flex gap-4 p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h3 className="font-display font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      {result.warnings.length > 0 && (
        <div className="card mt-4 border-wire-yellow/60 bg-yellow-50 p-4">
          <h3 className="font-display text-sm font-semibold">Heads-up from the engine</h3>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
