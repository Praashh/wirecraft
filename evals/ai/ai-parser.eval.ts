import { aiParsePrompt } from "~/lib/engine/ai";
import { afterAll, describe, expect, test } from "vitest";
import testCases from "./test-cases.json";
import { scoreReport } from "./score-report";

const hasApiKey = Boolean(process.env.GROQ_API_KEY);

interface TestCase {
    name: string;
    prompt: string;
    expected: {
        boards: string[];
        mustInclude: string[];
        shouldInclude: string[];
        mustHaveBehaviors: boolean;
        minComponents: number;
        maxComponents: number;
    };
}

describe.skipIf(!hasApiKey)("AI Parser (LLM Eval)", () => {
    afterAll(() => {
        scoreReport.printScorecard();
    });

    test.each(testCases as TestCase[])("$name ($prompt)", async (tc) => {
        const intent = await aiParsePrompt(tc.prompt);
        const { score, boardOk, partsOk, feedback } = scoreOutput(intent, tc.expected);

        scoreReport.addRecord({
            name: tc.name,
            score,
            board: intent.board,
            boardOk,
            mustParts: intent.componentIds.join(", "),
            partsOk,
            behaviorsCount: intent.behaviors.length,
            feedback,
        });

        expect(score).toBeGreaterThanOrEqual(70);
    }, 20000);
});


function scoreOutput(intent: Awaited<ReturnType<typeof aiParsePrompt>>, expected: TestCase["expected"]) {
    let score = 0;
    const feedback: string[] = [];

    // 1. Board Selection (25 pts)
    const boardOk = expected.boards.includes(intent.board);
    if (boardOk) score += 25;
    else feedback.push(`Picked board '${intent.board}', expected one of: ${expected.boards.join(", ")}`);

    // 2. Must-Include Components (40 pts)
    const matchedMust = expected.mustInclude.filter(c => intent.componentIds.includes(c));
    const mustScore = expected.mustInclude.length > 0
        ? Math.round((matchedMust.length / expected.mustInclude.length) * 40)
        : 40;
    score += mustScore;
    const partsOk = matchedMust.length === expected.mustInclude.length;
    if (!partsOk) {
        const missing = expected.mustInclude.filter(c => !intent.componentIds.includes(c));
        feedback.push(`Missing must-have components: ${missing.join(", ")}`);
    }

    // 3. Behavior Rules (25 pts)
    const behaviorsOk = !expected.mustHaveBehaviors || intent.behaviors.length > 0;
    if (behaviorsOk) score += 25;
    else feedback.push("Missing expected sensor-to-actuator behavior rules");

    // 4. Component Count (10 pts)
    const count = intent.componentIds.length;
    if (count >= expected.minComponents && count <= expected.maxComponents) {
        score += 10;
    } else {
        feedback.push(`Component count ${count} outside range [${expected.minComponents}, ${expected.maxComponents}]`);
    }

    return { score, boardOk, partsOk, feedback };
}
