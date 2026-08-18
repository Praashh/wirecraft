# Wirecraft

An open-source, self-hostable AI hardware workbench for Arduino Uno, ESP32, and Raspberry Pi Pico. Describe your gadget in plain language to generate:

- **Firmware** — Arduino C++ sketch and `platformio.ini` config.
- **Wiring Diagrams** — Color-coded interactive SVG maps.
- **BOM** — Component list, estimated prices, and reference designators.
- **Build Steps** — Assembly instructions with part-specific tips.
- **ZIP Export** — Complete, flash-ready PlatformIO workspace.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: SQLite (via Prisma 7 & `better-sqlite3`)
- **API**: tRPC v11 & React Query
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth (Credentials)

---

## Quick Start

### 1. Configure Environment
Copy `.env.example` to `.env` and fill in your keys:
```env
GROQ_API_KEY="your-groq-api-key"
NEXTAUTH_SECRET="any-random-32-char-string"
NEXTAUTH_URL="http://localhost:3000"
```
> A Groq API key is required for AI generation. Get one free at [console.groq.com/keys](https://console.groq.com/keys).

### 2. Setup & Run
```bash
bun install
bun run setup     # Push schema + seed initial templates
bun run dev       # Start development server at http://localhost:3000
```

---

## Project Layout

```
├── prisma/             # Schema & seeding scripts
├── public/             # Branding & OG image assets
├── src/
│   ├── app/            # Next.js pages & routes (/, /app, /guides, etc.)
│   ├── components/     # Workbench IDE, SVG viewers, landing blocks, and shared UI
│   ├── lib/engine/     # Pin allocator, code gen, catalog, and parser
│   └── server/         # tRPC, auth, and database helpers
├── evals/              # Vitest eval suites for the engine
└── harbor/             # Harbor AI eval benchmark dataset
```

---

## Docker

The [`Dockerfile`](./Dockerfile) defines the sandbox image used by [Harbor evaluations](#harbor-evaluations). It is **not** required to run the web app.

```bash
# Build wirecraft-base and wirecraft-buggy images
./harbor/build_base.sh
```

The image is based on `node:20-alpine` with `bash`, `grep`, and `sed` installed — chosen for its minimal CVE surface while maintaining full compatibility with `npm`, `npx`, and `tsx`.

---

## Harbor Evaluations

Wirecraft ships a [Harbor](https://harborframework.com) benchmark dataset for testing AI coding agents. See [`harbor/README.md`](./harbor/README.md) for full details.

### Run

```bash
# Build sandbox images first
./harbor/build_base.sh

# Run all tasks with the oracle agent (should score 1.000)
harbor run --path ./harbor/dataset --agent oracle

# Run with a real agent
export ANTHROPIC_API_KEY="sk-ant-..."
harbor run --path ./harbor/dataset --agent claude-code
```

### Tasks

| Task | Difficulty | Goal |
|------|-----------|------|
| `add-catalog-component` | Easy | Add a KY-026 flame sensor to `catalog.ts` |
| `fix-allocator-bug` | Medium | Debug & fix 2 injected bugs in `allocator.ts` |
| `add-new-template` | Medium | Add a Greenhouse Climate Controller template |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | SQLite path (`file:./dev.db`) or PostgreSQL URL |
| `NEXTAUTH_SECRET` | ✅ | Random secret string (≥32 chars) |
| `NEXTAUTH_URL` | ✅ | Base URL (e.g. `http://localhost:3000`) |
| `GROQ_API_KEY` | ✅ | Groq API key for LLM inference |
| `OLLAMA_URL` | ❌ | Ollama base URL for local LLM |
| `OLLAMA_MODEL` | ❌ | Ollama model name |
