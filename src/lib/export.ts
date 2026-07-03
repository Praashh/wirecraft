import JSZip from "jszip";
import type { BuildResult } from "~/lib/engine/types";

export async function exportProjectZip(result: BuildResult) {
  const zip = new JSZip();
  const slug = result.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "project";

  zip.file("platformio.ini", result.platformioIni);
  zip.file("src/main.cpp", result.code);

  const bomCsv = [
    "Part,Refs,Qty,Estimated price (USD)",
    ...result.bom.map((b) => `"${b.name}","${b.refs.join(" ")}",${b.qty},${(b.qty * b.price).toFixed(2)}`),
  ].join("\n");
  zip.file("docs/bom.csv", bomCsv);

  const wiring = [
    `# Wiring — ${result.name} (${result.boardLabel})`,
    "",
    "| Board pin | Component | Pin |",
    "| --- | --- | --- |",
    ...result.wires.map((w) => `| ${w.fromBoardPin} | ${w.toComponent} | ${w.toPin} |`),
  ].join("\n");
  zip.file("docs/wiring.md", wiring);

  const readme = [
    `# ${result.name}`,
    "",
    result.summary,
    "",
    "## Flash it",
    "",
    "1. Install VS Code + the free PlatformIO extension.",
    "2. Open this folder (`File → Open Folder`).",
    `3. Plug in your ${result.boardLabel} over USB.`,
    "4. Click the PlatformIO **Upload** arrow. Libraries download automatically.",
    "",
    "Prefer the Arduino IDE? Copy `src/main.cpp` into a new sketch and install the libraries listed in `platformio.ini` from the Library Manager.",
    "",
    "## Build steps",
    "",
    ...result.steps.map((s, i) => `${i + 1}. **${s.title}** — ${s.body}`),
    "",
    "---",
    "Generated with Wirecraft.",
  ].join("\n");
  zip.file("README.md", readme);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
