"use client";

import { useMemo, useState } from "react";
import type { BuildResult } from "~/lib/engine/types";

function tint(line: string, key: number) {
  if (line.trimStart().startsWith("//") || line.trimStart().startsWith(";")) {
    return (
      <span key={key} className="text-emerald-700">
        {line}
      </span>
    );
  }
  if (line.startsWith("#include") || line.startsWith("#define") || line.startsWith("[env")) {
    return (
      <span key={key} className="text-primary">
        {line}
      </span>
    );
  }
  return <span key={key}>{line}</span>;
}

function Pane({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(
    () => text.split("\n").map((content, n) => ({ lineNum: n + 1, content })),
    [text],
  );
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-line bg-board px-4 py-2">
        <span className="font-mono text-xs font-semibold text-muted">{label}</span>
        <button type="button" onClick={copy} className="chip">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[520px] overflow-auto p-4 font-mono text-[12.5px] leading-relaxed">
        <code>
          {lines.map(({ lineNum, content }) => (
            <div key={lineNum} className="whitespace-pre">
              <span className="mr-4 inline-block w-6 select-none text-right text-muted/50">{lineNum}</span>
              {tint(content, lineNum)}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export function CodeView({ result }: { result: BuildResult }) {
  return (
    <div className="h-full space-y-4 overflow-auto bg-board p-4">
      <Pane label="src/main.cpp" text={result.code} />
      <Pane label="platformio.ini" text={result.platformioIni} />
    </div>
  );
}
