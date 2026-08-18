# Add a "Flame Sensor" Component to the Wirecraft Catalog

## Context

Wirecraft is an AI hardware workbench that generates Arduino/ESP32/Pico projects from natural language. The heart of the system is a **component catalog** at `src/lib/engine/catalog.ts` that defines every sensor and actuator the engine can use.

Each catalog entry is a `CatalogComponent` object (defined in `src/lib/engine/types.ts`) with: id, name, shortName, category, keywords, summary, price, pins, libs, code snippets, and build tips.

## Your Task

Add a new **KY-026 Flame Sensor** component to the catalog. The flame sensor is an analog IR sensor that detects fire/flame. Here are the real-world specs you should use:

### Component Specs

| Field | Value |
|-------|-------|
| id | `"flame"` |
| name | `"KY-026 flame sensor module"` |
| shortName | `"Flame"` |
| category | `"Sensor"` |
| keywords | `["flame", "fire", "infrared", "ir", "heat", "smoke", "safety"]` |
| summary | `"Analog IR flame detector — returns a higher reading when it sees fire."` |
| price | `1.20` |
| buildTip | `"Point the IR receiver toward the area you want to monitor. Works best within 1 m."` |

### Pin Configuration

The KY-026 has 3 pins:
1. **VCC** — power pin, 3.3V
2. **AO** — analog output (analog pin kind)
3. **GND** — ground

Use appropriate wire colors from the existing color palette `C` defined at the top of the file.

### Code Configuration

- **No external libraries** needed (empty `libs` array)
- **No includes** needed
- **Define**: `#define {REF}_PIN {PIN:AO}` — maps the analog output pin
- **Global variable**: `int {ref}FlameRaw = 0;` — stores the raw analog reading
- **Setup**: `pinMode({REF}_PIN, INPUT);`
- **Loop**: `{ref}FlameRaw = analogRead({REF}_PIN);`
- **readingVar**: `"{ref}FlameRaw"` — this makes it available as a sensor for behavior rules
- **No actuate** field (it's a sensor, not an actuator)

### Where to Add It

Add the new component to the `CATALOG` array in `src/lib/engine/catalog.ts`. Follow the existing pattern used by components like `"soil"`, `"ldr"`, or `"dht22"`.

## Acceptance Criteria

1. The flame sensor must be findable via `byId("flame")` — i.e., it exists in the CATALOG array with `id: "flame"`.
2. It must have exactly 3 pins: VCC (power), AO (analog), GND (gnd).
3. The `readingVar` must be set so the engine can use it in behavior rules.
4. All existing tests must continue to pass (`npm run test`).
5. The allocator must be able to place it on all 3 boards (Arduino Uno, ESP32, Pico).
