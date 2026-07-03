# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wirecraft is an open-source, self-hostable AI hardware workbench for Arduino Uno, ESP32, and Raspberry Pi Pico. It's a web IDE that translates natural language descriptions into complete hardware projects: firmware (Arduino C++), wiring diagrams (SVG), parts lists, and assembly instructions.

## Commands

```bash
npm install              # Install dependencies (auto-generates Prisma client via postinstall)
npm run dev              # Start Next.js dev server at http://localhost:3000
npm run build            # Production build
npm run db:push          # Push Prisma schema to database
npm run db:seed          # Seed database with templates and catalog parts
npm run setup            # db:push + db:seed (run after fresh clone)
```

Local development uses SQLite (`dev.db`) by default. Set `DATABASE_URL` for PostgreSQL.

## Architecture

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · tRPC v11 · Prisma 7.8 · NextAuth v4 · Tailwind CSS 3.4

**Path alias:** `~/*` maps to `./src/*`

### Core Build Engine (`src/lib/engine/`)

The heart of the app — a deterministic pipeline that converts natural language into hardware projects:

1. **Parser** (`parser.ts`) — Matches prompts against archetype recipes, extracts board, components, behaviors
2. **Allocator** (`allocator.ts`) — Assigns components to board pins respecting capabilities (digital/PWM/analog/I2C), generates wire connections with color coding
3. **Code Generator** (`codegen.ts`) — Emits Arduino C++ sketch + `platformio.ini`
4. **Steps Generator** (`stepsgen.ts`) — Produces assembly instructions and BOM with prices

Supporting files: `boards.ts` (3 board profiles with pin layouts), `catalog.ts` (50+ components with pins/code snippets/prices), `templates.ts` (pre-made project templates), `types.ts` (core interfaces)

### Server (`src/server/`)

- `db.ts` — Prisma client init with PostgreSQL + SQLite adapters
- `auth.ts` — NextAuth config (credentials provider, JWT strategy, bcryptjs hashing)
- `api/routers/` — tRPC routers: `project`, `user`, `guide`, `part`

### Frontend (`src/components/`)

- `ide/` — Workbench IDE: chat interface, SVG wiring diagram, code viewer, parts list, assembly steps
- `landing/` — Homepage components (hero, nav, template gallery)
- `ui/` — Shared components (brand logo, procedural thumbnails)

### Data Flow

1. User prompt → tRPC `project.create` / `project.iterate`
2. Engine pipeline (parser → allocator → codegen → stepsgen) produces `BuildResult`
3. `BuildResult` stored as JSON in `project.data` column; chat messages stored separately
4. Frontend renders BuildResult across tabs: Wiring, Code, Parts, Steps
5. Export bundles a PlatformIO ZIP (firmware + BOM CSV + wiring docs)

### Ownership Model

Guest users get a `wc_guest` HttpOnly cookie (UUID). On registration, guest projects are auto-adopted into the new account. Projects are queried by `userId` (authenticated) or `guestId` (guest).

### Database Models (Prisma)

`User`, `Project` (with JSON `data` field for BuildResult), `Message`, `Guide`, `Part`

## Environment Variables

**Required:** `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
**Optional:** `OLLAMA_URL` + `OLLAMA_MODEL` (local LLM for chattier assistant replies)

## Extending

- **New component:** Add to `src/lib/engine/catalog.ts` (pins, code snippets, price), update parser recipes if needed, re-seed
- **New board:** Add to `src/lib/engine/boards.ts` (pins, SVG layout), update allocator for special pin handling
- **New template:** Add to `src/lib/engine/templates.ts`, re-seed
- **New API route:** Add tRPC procedure in `src/server/api/routers/`, register in `root.ts`
