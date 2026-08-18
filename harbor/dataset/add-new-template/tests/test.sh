#!/bin/bash
# =============================================================================
# Harbor Test Script: add-new-template
# =============================================================================
set -euo pipefail

mkdir -p /logs/verifier
echo "0" > /logs/verifier/reward.txt

echo "=== Test: add-new-template ==="

# 1. Check template exists in source
echo "[1/4] Checking template exists in source..."
if ! grep -q 'greenhouse-climate-ctrl' src/lib/engine/templates.ts; then
  echo "FAIL: Template with slug 'greenhouse-climate-ctrl' not found in templates.ts"
  exit 1
fi
echo "  ✓ Template slug found in source"

# 2. Check template fields
echo "[2/4] Checking template fields..."
TEMPLATE_BLOCK=$(grep -A 15 'greenhouse-climate-ctrl' src/lib/engine/templates.ts)

if ! echo "$TEMPLATE_BLOCK" | grep -qi 'garden'; then
  echo "FAIL: Template category should be 'Garden'"
  exit 1
fi
echo "  ✓ Category is Garden"

if ! echo "$TEMPLATE_BLOCK" | grep -q 'esp32'; then
  echo "FAIL: Template board should be 'esp32'"
  exit 1
fi
echo "  ✓ Board is esp32"

if ! echo "$TEMPLATE_BLOCK" | grep -q 'plant'; then
  echo "FAIL: Template icon should be 'plant'"
  exit 1
fi
echo "  ✓ Icon is plant"

# 3. Build template end-to-end
echo "[3/4] Building template end-to-end..."
npx tsx -e "
  import { templateBySlug } from './src/lib/engine/templates.ts';
  import { buildProject } from './src/lib/engine/engine.ts';

  (async () => {
    const tmpl = templateBySlug('greenhouse-climate-ctrl');
    if (!tmpl) {
      console.error('FAIL: templateBySlug returned undefined');
      process.exit(1);
    }
    console.log('  Template found:', tmpl.title);

    const result = await buildProject(tmpl.prompt, tmpl.board, { offline: true });

    if (!result.name) {
      console.error('FAIL: Build result has no name');
      process.exit(1);
    }
    console.log('  Project name:', result.name);

    if (result.components.length < 2) {
      console.error('FAIL: Expected at least 2 components, got', result.components.length);
      process.exit(1);
    }
    console.log('  Components:', result.components.length);

    if (!result.code.includes('void setup()') || !result.code.includes('void loop()')) {
      console.error('FAIL: Generated code missing setup() or loop()');
      process.exit(1);
    }
    console.log('  ✓ Firmware has setup() and loop()');

    if (result.steps.length < 4) {
      console.error('FAIL: Expected at least 4 build steps, got', result.steps.length);
      process.exit(1);
    }
    console.log('  ✓ Build steps:', result.steps.length);

    if (result.bom.length < 1) {
      console.error('FAIL: BOM is empty');
      process.exit(1);
    }
    console.log('  ✓ BOM entries:', result.bom.length);

    console.log('  ✓ Template builds successfully end-to-end');
  })().catch(err => {
    console.error('FAIL:', err);
    process.exit(1);
  });
"
echo "  ✓ End-to-end build passed"

# 4. Run existing eval suite
echo "[4/4] Running existing eval suite..."
npx vitest run evals/engine --reporter=verbose 2>&1
echo "  ✓ All existing evals pass"

echo "1" > /logs/verifier/reward.txt
echo "=== PASS: add-new-template ==="
exit 0
