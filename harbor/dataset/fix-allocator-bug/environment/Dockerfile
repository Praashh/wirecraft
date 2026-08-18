FROM wirecraft-base:latest

# Inject the two bugs into allocator.ts for the agent to fix
# Bug 1: Remove "digital" fallback from PWM allocation
RUN sed -i 's/take(\["pwm", "digital"\])/take(["pwm"])/' src/lib/engine/allocator.ts
# Bug 2: Invert the voltage check (check === 5 instead of === 3.3)
RUN sed -i 's/board\.volts === 3\.3/board.volts === 5/' src/lib/engine/allocator.ts
