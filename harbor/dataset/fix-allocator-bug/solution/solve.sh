#!/bin/bash
set -euo pipefail

# Fix Bug 1: Restore ["pwm", "digital"] fallback
sed -i 's/take(\["pwm"\])/take(["pwm", "digital"])/' src/lib/engine/allocator.ts

# Fix Bug 2: Restore 3.3V check
sed -i 's/board\.volts === 5/board.volts === 3.3/' src/lib/engine/allocator.ts
