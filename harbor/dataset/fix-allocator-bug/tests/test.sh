#!/bin/bash
# =============================================================================
# Harbor Test Script: fix-allocator-bug
# =============================================================================
set -euo pipefail

mkdir -p /logs/verifier
echo "0" > /logs/verifier/reward.txt

echo "=== Test: fix-allocator-bug ==="

# 1. Check PWM fallback
echo "[1/3] Checking PWM-to-digital fallback is restored..."
if grep -q 'take(\["pwm"\])' src/lib/engine/allocator.ts; then
  echo "FAIL: PWM allocation still missing digital fallback"
  exit 1
fi

if ! grep -q 'take(\["pwm", "digital"\])' src/lib/engine/allocator.ts; then
  echo "FAIL: PWM allocation does not have correct fallback"
  exit 1
fi
echo "  ✓ PWM fallback correctly includes digital"

# 2. Check voltage check
echo "[2/3] Checking voltage warning logic..."
if grep -q 'board\.volts === 5' src/lib/engine/allocator.ts; then
  echo "FAIL: Voltage check is still inverted (checking === 5 instead of === 3.3)"
  exit 1
fi

if ! grep -q 'board\.volts === 3\.3' src/lib/engine/allocator.ts; then
  echo "FAIL: Voltage check does not compare against 3.3"
  exit 1
fi
echo "  ✓ Voltage warning logic is correct"

# 3. Run full eval suite
echo "[3/3] Running full eval suite..."
npx vitest run evals/engine --reporter=verbose 2>&1
echo "  ✓ All evals pass"

echo "1" > /logs/verifier/reward.txt
echo "=== PASS: fix-allocator-bug ==="
exit 0
