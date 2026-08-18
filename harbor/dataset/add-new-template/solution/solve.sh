#!/bin/bash
set -euo pipefail

node -e "
const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/templates.ts', 'utf8');

const templateDef = \`  {
    slug: \"greenhouse-climate-ctrl\",
    title: \"Greenhouse Climate Controller\",
    category: \"Garden\",
    board: \"esp32\",
    prompt: \"A greenhouse controller with a DHT22 sensor for temperature and humidity, an OLED display for readings, a relay to control a fan, and an LED status indicator\",
    summary: \"DHT22 reads the climate, OLED shows the data, relay runs the fan. Your tomatoes will thrive.\",
    hue: 85,
    icon: \"plant\",
  },
\`;

code = code.replace(/export const TEMPLATES: TemplateDef\[\] = \[/, 'export const TEMPLATES: TemplateDef[] = [\n' + templateDef);
fs.writeFileSync('src/lib/engine/templates.ts', code);
"
