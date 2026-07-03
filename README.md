# Wirecraft

An open-source, self-hostable AI hardware workbench for Arduino Uno, ESP32, and Raspberry Pi Pico. Describe your gadget in plain language to generate:

- **Firmware** — Arduino C++ sketch and `platformio.ini` config.
- **Wiring Diagrams** — Color-coded interactive SVG maps.
- **BOM** — Component list, estimated prices, and reference designators.
- **Build Steps** — Assembly instructions with part-specific tips.
- **ZIP Export** — Complete, flash-ready PlatformIO workspace.

---

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (via Prisma 6 & `better-sqlite3`)
- **API**: tRPC v11 & React Query
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth (Credentials)

---

## Quick Start

### 1. Configure Environment
Copy `.env.example` to `.env` and configure your Groq key:
```env
GROQ_API_KEY="your-groq-api-key"
```
> Note: A Groq API Key is required for dynamic workbench generations. Get a free key at [Groq Console](https://console.groq.com/keys).

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
│   ├── app/            # Next.js Pages & Routes (/, /app, /guides, etc.)
│   ├── components/     # Workbench IDE, SVG viewers, landing blocks, and shared UI
│   ├── lib/engine/     # Pin allocator, code gen, catalog, and parser
│   └── server/         # tRPC, auth, and database helpers
```

---

