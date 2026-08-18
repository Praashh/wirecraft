#!/bin/bash
# =============================================================================
# Setup Script: Injects a bug into the allocator
#
# Bug: When allocating a PWM pin, the allocator should try ["pwm", "digital"]
# as fallback kinds. This script changes it to try ONLY ["pwm"], so any
# board without enough dedicated PWM pins will fail to allocate buzzers,
# servos, etc. on some boards.
#
# Additionally, the voltage warning logic is inverted: the condition checks
# board.volts === 5 instead of board.volts === 3.3, so voltage warnings
# fire on 5V boards (where they shouldn't) and NOT on 3.3V boards (where
# they should).
# =============================================================================
set -euo pipefail

echo "Injecting allocator bugs..."

# Bug 1: Remove "digital" fallback from PWM allocation
# Original: const p = take(["pwm", "digital"]);
# Bugged:   const p = take(["pwm"]);
sed -i.bak 's/take(\["pwm", "digital"\])/take(["pwm"])/' src/lib/engine/allocator.ts

# Bug 2: Invert the voltage check
# Original: if (wantsV5 && board.volts === 3.3)
# Bugged:   if (wantsV5 && board.volts === 5)
sed -i.bak 's/board\.volts === 3\.3/board.volts === 5/' src/lib/engine/allocator.ts

rm -f src/lib/engine/allocator.ts.bak

echo "Bugs injected. Good luck, agent!"
