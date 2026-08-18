#!/bin/bash
set -euo pipefail

# Add the flame sensor component right before the closing bracket of CATALOG in catalog.ts
node -e "
const fs = require('fs');
let code = fs.readFileSync('src/lib/engine/catalog.ts', 'utf8');

const flameComponent = \`  {
    id: \"flame\",
    name: \"KY-026 flame sensor module\",
    shortName: \"Flame\",
    category: \"Sensor\",
    keywords: [\"flame\", \"fire\", \"infrared\", \"ir\", \"heat\", \"smoke\", \"safety\"],
    summary: \"Analog IR flame detector — returns a higher reading when it sees fire.\",
    price: 1.20,
    pins: [
      { name: \"VCC\", kind: \"power\", color: C.red, volts: 3.3 },
      { name: \"AO\", kind: \"analog\", color: C.yellow },
      { name: \"GND\", kind: \"gnd\", color: C.black },
    ],
    libs: [],
    code: {
      includes: [],
      defines: [\"#define {REF}_PIN {PIN:AO}\"],
      globals: [\"int {ref}FlameRaw = 0;\"],
      setup: [\"pinMode({REF}_PIN, INPUT);\"],
      loop: [\"{ref}FlameRaw = analogRead({REF}_PIN);\"],
    },
    readingVar: \"{ref}FlameRaw\",
    buildTip: \"Point the IR receiver toward the area you want to monitor. Works best within 1 m.\",
  },
\`;

code = code.replace(/export const CATALOG: CatalogComponent\[\] = \[/, 'export const CATALOG: CatalogComponent[] = [\n' + flameComponent);
fs.writeFileSync('src/lib/engine/catalog.ts', code);
"
