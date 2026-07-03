"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import type { BoardId, BuildResult } from "~/lib/engine/types";
import { BOARDS, BOARD_ORDER } from "~/lib/engine/boards";
import { exportProjectZip } from "~/lib/export";
import { Wordmark } from "~/components/ui/Brand";
import { WiringDiagram } from "./WiringDiagram";
import { CodeView } from "./CodeView";
import { PartsList } from "./PartsList";
import { StepsView } from "./StepsView";

const Viewer3D = dynamic(() => import("./Viewer3D").then((m) => m.Viewer3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-board">
      <p className="font-mono text-sm text-muted">Loading 3D viewer…</p>
    </div>
  ),
});

type Tab = "wiring" | "3d" | "code" | "parts" | "steps";
interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "wiring", label: "Wiring" },
  { id: "3d", label: "3D" },
  { id: "code", label: "Code" },
  { id: "parts", label: "Parts" },
  { id: "steps", label: "Steps" },
];

function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <p key={i} className={line === "" ? "h-2" : ""}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
            seg.startsWith("**") && seg.endsWith("**") ? (
              <strong key={j}>{seg.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{seg}</span>
            ),
          )}
        </p>
      ))}
    </>
  );
}

const GUEST_PROJECT_LIMIT = 3;

export function Workbench() {
  const params = useSearchParams();
  const urlPrompt = params.get("prompt") ?? "";
  const urlBoard = (params.get("board") as BoardId | null) ?? undefined;
  const urlProject = params.get("project");

  const [projectId, setProjectId] = useState<string | null>(urlProject);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<Tab>("wiring");
  const [board, setBoard] = useState<BoardId>(urlBoard && BOARDS[urlBoard] ? urlBoard : "esp32");
  const bootstrapped = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const utils = api.useUtils();
  const projects = api.project.list.useQuery();

  const isGuestLimitReached = (): boolean => {
    if (session?.user) return false;
    if ((projects.data?.length ?? 0) >= GUEST_PROJECT_LIMIT) {
      toast.error(
        "You have reached your maximum project limit as a guest. Please login to create more projects.",
        { action: { label: "Sign in", onClick: () => (window.location.href = "/signin") } },
      );
      return true;
    }
    return false;
  };

  const create = api.project.create.useMutation({
    onSuccess: ({ project, result }) => {
      setProjectId(project.id);
      setResult(result);
      setMessages(project.messages.map((m) => ({ role: m.role as ChatMsg["role"], content: m.content })));
      setBoard(result.board);
      void utils.project.list.invalidate();
      window.history.replaceState(null, "", `/app?project=${project.id}`);
    },
    onError: (err) =>
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            err.data?.code === "FORBIDDEN"
              ? "You've hit the guest project limit. **Sign up for a free account** to keep building unlimited projects!"
              : "Something snagged while generating. Try rephrasing your idea.",
        },
      ]),
  });

  const iterate = api.project.iterate.useMutation({
    onSuccess: ({ project, result }) => {
      setResult(result);
      setMessages(project.messages.map((m) => ({ role: m.role as ChatMsg["role"], content: m.content })));
      setBoard(result.board);
      void utils.project.list.invalidate();
    },
  });

  const load = api.project.get.useQuery(
    { id: projectId ?? "" },
    { enabled: !!projectId && !result },
  );

  useEffect(() => {
    if (load.data) {
      setResult(load.data.result);
      setBoard(load.data.result.board);
      setMessages(
        load.data.project.messages.map((m) => ({ role: m.role as ChatMsg["role"], content: m.content })),
      );
    }
  }, [load.data]);

  useEffect(() => {
    if (bootstrapped.current) return;
    if (urlPrompt && !urlProject) {
      bootstrapped.current = true;
      setMessages([{ role: "user", content: urlPrompt }]);
      create.mutate({ prompt: urlPrompt, board: urlBoard });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, create.isPending, iterate.isPending]);

  const busy = create.isPending || iterate.isPending;

  const send = () => {
    const text = input.trim();
    if (!text || busy) return;
    if (!projectId && isGuestLimitReached()) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    if (projectId) {
      iterate.mutate({ projectId, message: text, board });
    } else {
      create.mutate({ prompt: text, board });
    }
  };

  const switchBoard = (b: BoardId) => {
    setBoard(b);
    if (projectId && result) {
      setMessages((m) => [...m, { role: "user", content: `Switch the build to a ${BOARDS[b].label}.` }]);
      iterate.mutate({ projectId, message: `use a ${BOARDS[b].label}`, board: b });
    }
  };

  const newProject = () => {
    setProjectId(null);
    setResult(null);
    setMessages([]);
    window.history.replaceState(null, "", "/app");
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Back to home">
            <Wordmark />
          </Link>
          {result && (
            <span className="hidden font-display text-sm font-semibold sm:inline">
              {result.name}
              <span className="ml-2 font-mono text-xs font-normal text-muted">{result.boardLabel}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={newProject} className="btn-ghost !px-3.5 !py-2 text-xs">
            New build
          </button>
          <button
            onClick={() => result && void exportProjectZip(result)}
            disabled={!result}
            className="btn-primary !px-3.5 !py-2 text-xs disabled:opacity-40"
          >
            Export PlatformIO ↓
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section className="flex min-h-0 w-full flex-col border-b border-line bg-surface md:h-auto md:w-[380px] md:border-b-0 md:border-r" aria-label="Build chat">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            {BOARD_ORDER.map((b) => (
              <button
                key={b}
                onClick={() => switchBoard(b)}
                className={`chip !px-2.5 !py-1 !text-[10px] ${board === b ? "chip-active" : ""}`}
              >
                {BOARDS[b].svg.name}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="min-h-[180px] flex-1 space-y-3 overflow-auto p-3">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <p className="font-display text-lg font-bold">What are we building?</p>
                <p className="max-w-[30ch] text-sm text-muted">
                  Describe a gadget, or pick a starting point:
                </p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {["a plant waterer", "a parking sensor", "a motion alarm", "a mood lamp", "a treat dispenser"].map(
                    (s) => (
                      <button
                        key={s}
                        className="chip"
                        onClick={() => {
                          if (isGuestLimitReached()) return;
                          setMessages([{ role: "user", content: `Build ${s}` }]);
                          create.mutate({ prompt: `Build ${s}`, board });
                        }}
                      >
                        {s}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-sm text-white"
                    : "mr-4 rounded-2xl rounded-bl-md border border-line bg-board px-3.5 py-2.5 text-sm leading-relaxed"
                }
              >
                <RichText text={m.content} />
              </div>
            ))}
            {busy && (
              <div className="mr-4 rounded-2xl rounded-bl-md border border-line bg-board px-3.5 py-2.5 font-mono text-xs text-muted">
                <span className="blink-cursor">allocating pins, routing wires </span>
              </div>
            )}
          </div>

          <div className="border-t border-line p-3">
            <div className="flex items-end gap-2 rounded-xl border border-line bg-board p-1.5 focus-within:border-ink">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder={result ? 'Iterate — "add a display", "make it quieter"…' : "Describe your build…"}
                className="max-h-28 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted/70"
                aria-label="Message"
              />
              <button onClick={send} disabled={busy} className="btn-primary !px-3 !py-1.5 text-xs disabled:opacity-40">
                Send
              </button>
            </div>
            {projects.data && projects.data.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer font-mono text-[11px] text-muted hover:text-ink">
                  Your builds ({projects.data.length})
                </summary>
                <ul className="mt-1.5 max-h-32 space-y-1 overflow-auto">
                  {projects.data.map((p) => (
                    <li key={p.id}>
                      <a
                        href={`/app?project=${p.id}`}
                        className="block truncate rounded-lg px-2 py-1.5 text-xs hover:bg-board"
                      >
                        <span className="font-medium">{p.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-muted">{BOARDS[p.board as BoardId]?.svg.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col" aria-label="Build output">
          <div className="flex items-center gap-1 border-b border-line bg-surface px-3 py-2" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-pill px-3.5 py-1.5 font-display text-sm font-medium transition ${
                  tab === t.id ? "bg-ink text-white" : "text-muted hover:bg-board hover:text-ink"
                }`}
              >
                {t.label}
                {t.id === "parts" && result ? ` · ${result.bom.length}` : ""}
                {t.id === "wiring" && result ? ` · ${result.wires.length}` : ""}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1">
            {!result ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 bg-dots bg-board p-8 text-center">
                <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="#B9BCC4" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="8" y="20" width="48" height="24" rx="6" />
                  <circle cx="18" cy="32" r="2" fill="#B9BCC4" />
                  <circle cx="28" cy="32" r="2" fill="#B9BCC4" />
                  <circle cx="38" cy="32" r="2" fill="#B9BCC4" />
                  <circle cx="48" cy="32" r="2" fill="#B9BCC4" />
                </svg>
                <p className="font-display font-semibold text-muted">The bench is empty</p>
                <p className="max-w-[36ch] text-sm text-muted/80">
                  Describe a build in the chat and the wiring diagram, firmware, parts and steps will appear here.
                </p>
              </div>
            ) : tab === "wiring" ? (
              <WiringDiagram result={result} />
            ) : tab === "3d" ? (
              <Viewer3D result={result} />
            ) : tab === "code" ? (
              <CodeView result={result} />
            ) : tab === "parts" ? (
              <PartsList result={result} />
            ) : (
              <StepsView result={result} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
