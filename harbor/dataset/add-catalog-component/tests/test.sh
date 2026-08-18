#!/bin/bash
# =============================================================================
# Harbor Test Script: add-catalog-component
# =============================================================================
set -euo pipefail

# Ensure verifier log dir exists and default reward is 0
mkdir -p /logs/verifier
echo "0" > /logs/verifier/reward.txt

echo "=== Test: add-catalog-component ==="

# 1. Check that "flame" appears in the catalog source
echo "[1/5] Checking catalog source for flame sensor..."
if ! grep -q 'id: "flame"' src/lib/engine/catalog.ts && \
   ! grep -q "id: 'flame'" src/lib/engine/catalog.ts; then
  echo "FAIL: No component with id 'flame' found in catalog.ts"
  exit 1
fi
echo "  ✓ Found 'flame' component in catalog"

# 2. Check pin configuration
echo "[2/5] Checking pin structure..."
if ! grep -A 30 'id: "flame"' src/lib/engine/catalog.ts | grep -q '"analog"' && \
   ! grep -A 30 "id: 'flame'" src/lib/engine/catalog.ts | grep -q "'analog'"; then
  echo "FAIL: Flame sensor missing analog pin kind"
  exit 1
fi
echo "  ✓ Analog pin found"

# 3. Check readingVar
echo "[3/5] Checking readingVar..."
if ! grep -A 40 'id: "flame"' src/lib/engine/catalog.ts | grep -q 'readingVar' && \
   ! grep -A 40 "id: 'flame'" src/lib/engine/catalog.ts | grep -q 'readingVar'; then
  echo "FAIL: Flame sensor missing readingVar"
  exit 1
fi
echo "  ✓ readingVar is defined"

# 4. Run existing test suite
echo "[4/5] Running existing eval suite..."
npx vitest run evals/engine --reporter=verbose 2>&1
echo "  ✓ All existing evals pass"

# 5. Run runtime checks
echo "[5/5] Running runtime verification..."
npx tsx -e "
  import { byId } from './src/lib/engine/catalog.ts';
  import { allocate } from './src/lib/engine/allocator.ts';

  const flame = byId('flame');
  console.log('  Component found:', flame.name);

  if (flame.pins.length !== 3) {
    console.error('FAIL: Expected 3 pins, got', flame.pins.length);
    process.exit(1);
  }
  console.log('  ✓ Pin count correct (3)');

  if (flame.category !== 'Sensor') {
    console.error('FAIL: Expected category Sensor, got', flame.category);
    process.exit(1);
  }
  console.log('  ✓ Category is Sensor');

  if (!flame.readingVar) {
    console.error('FAIL: readingVar is not defined');
    process.exit(1);
  }
  console.log('  ✓ readingVar defined:', flame.readingVar);

  for (const board of ['arduino-uno', 'esp32', 'pico']) {
    const result = allocate(board, ['flame']);
    if (result.components.length !== 1) {
      console.error('FAIL: Allocation failed on', board);
      process.exit(1);
    }
    console.log('  ✓ Allocates on', board);
  }

  console.log('  ✓ All runtime checks passed');
"

# Set reward to 1 on success
echo "1" > /logs/verifier/reward.txt
echo "=== PASS: add-catalog-component ==="
exit 0
