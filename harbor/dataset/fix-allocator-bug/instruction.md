# Fix the Pin Allocator Bugs

## Context

Wirecraft's **pin allocator** (`src/lib/engine/allocator.ts`) assigns components to available board pins based on pin kind compatibility (digital, PWM, analog, I²C, power, ground).

After a recent refactor, **two bugs were introduced** in the allocator. The test suite is now failing.

## Your Task

1. Run the existing test suite: `npx vitest run evals/engine`
2. Diagnose why the tests are failing by reading the error messages and the allocator source code
3. Fix the bugs in `src/lib/engine/allocator.ts`
4. Ensure **all tests pass** after your fix

## Hints

- Look at how pin kinds are resolved for different component types
- Look at the voltage warning logic — when should warnings fire?
- Compare the allocator behavior across different boards (Arduino Uno is 5V, ESP32 and Pico are 3.3V)
- The test file `evals/engine/allocator.eval.ts` has tests for PWM allocation, voltage warnings, and cross-board behavior

## Acceptance Criteria

1. All tests in `evals/engine/allocator.eval.ts` pass
2. All tests in `evals/engine/pipeline.eval.ts` pass (end-to-end builds still work)
3. No other files are modified besides `src/lib/engine/allocator.ts`
4. The fix should restore correct behavior, not work around the bug
