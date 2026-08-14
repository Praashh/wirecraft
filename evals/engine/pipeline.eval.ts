import { buildProject } from "~/lib/engine/engine";
import { TEMPLATES } from "~/lib/engine/templates";
import { describe, test } from "vitest";
import { validateBuildResult } from "./validate";

describe("pipeline (offline)", () => {
    test("builds plant waterer project end-to-end", async () => {
        const result = await buildProject(
            "water my plants when soil is dry",
            "arduino-uno",
            { offline: true }
        );
        validateBuildResult(result);
    });

    test("builds parking sensor project end-to-end", async () => {
        const result = await buildProject(
            "reversing parking sensor",
            "esp32",
            { offline: true }
        );
        validateBuildResult(result);
    });

    test("every built-in template builds successfully without crashing", async () => {
        for (const tmpl of TEMPLATES) {
            const result = await buildProject(
                tmpl.prompt,
                tmpl.board,
                { offline: true }
            );
            validateBuildResult(result);
        }
    });
});
