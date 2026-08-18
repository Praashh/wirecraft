# Add a "Greenhouse Climate Controller" Template

## Context

Wirecraft includes pre-made **project templates** at `src/lib/engine/templates.ts`. Each template has a slug, title, category, target board, natural language prompt, summary, a hue for thumbnail generation, and an icon.

Templates are important because:
1. They appear on the homepage as starter projects users can click
2. They are built via the offline engine pipeline (parser → allocator → codegen → stepsgen)
3. They must build successfully end-to-end without crashing

## Your Task

Add a new **"Greenhouse Climate Controller"** template to the `TEMPLATES` array. This template represents a smart greenhouse monitor that controls temperature and humidity.

### Template Specification

| Field | Value |
|-------|-------|
| slug | `"greenhouse-climate-ctrl"` |
| title | `"Greenhouse Climate Controller"` |
| category | `"Garden"` |
| board | `"esp32"` |
| prompt | `"A greenhouse controller with a DHT22 sensor for temperature and humidity, an OLED display for readings, a relay to control a fan, and an LED status indicator"` |
| summary | `"DHT22 reads the climate, OLED shows the data, relay runs the fan. Your tomatoes will thrive."` |
| hue | `85` |
| icon | `"plant"` |

### Where to Add It

Add the template to the `TEMPLATES` array in `src/lib/engine/templates.ts`. Place it near the other Garden-category templates.

### What Must Work

The prompt you write must contain keywords that the **offline parser** (`src/lib/engine/parser.ts`) can pick up. The parser matches prompts against recipes and extracts component IDs from catalog keywords.

Key components your prompt references:
- `dht22` — matched by keywords: temperature, humidity, weather, climate, dht
- `oled` — matched by keywords: display, screen, oled, dashboard
- `relay` — matched by keywords: relay, pump, switch, control, fan
- `led` — matched by keywords: led, light, indicator, status

## Acceptance Criteria

1. The template exists in the `TEMPLATES` array with slug `"greenhouse-climate-ctrl"` 
2. `templateBySlug("greenhouse-climate-ctrl")` returns the template
3. The template builds successfully end-to-end: `buildProject(template.prompt, template.board, { offline: true })` completes without errors
4. The build result contains at least 2 components
5. The build result has valid firmware (code with `void setup()` and `void loop()`)
6. All existing tests still pass
