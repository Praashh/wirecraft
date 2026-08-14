export interface EvalRecord {
    name: string;
    score: number;
    board: string;
    boardOk: boolean;
    mustParts: string;
    partsOk: boolean;
    behaviorsCount: number;
    feedback: string[];
}

class ScoreReport {
    private records: EvalRecord[] = [];

    addRecord(record: EvalRecord) {
        this.records.push(record);
    }

    printScorecard() {
        if (this.records.length === 0) return;

        console.log("\n");
        console.log("=========================================================================");
        console.log("                     📊 WIRECRAFT AI EVAL SCORECARD                      ");
        console.log("=========================================================================");

        const rows = this.records.map((r) => ({
            "Test Case": r.name,
            "Score": `${r.score}/100`,
            "Board": `${r.board} ${r.boardOk ? "✓" : "✗"}`,
            "Parts": r.mustParts,
            "Behaviors": `${r.behaviorsCount} rule(s)`,
        }));

        console.table(rows);

        const avgScore = Math.round(
            this.records.reduce((sum, r) => sum + r.score, 0) / this.records.length
        );

        console.log("-------------------------------------------------------------------------");
        console.log(`  OVERALL AVERAGE SCORE: ${avgScore}%  ${avgScore >= 70 ? "✅ PASS" : "❌ FAIL"}`);
        console.log("=========================================================================\n");
    }
}

export const scoreReport = new ScoreReport();
