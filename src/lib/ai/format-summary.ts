/**
 * Splits a Markdown-ish model reply into plain bullet strings:
 * strips list markers ("-", "*", "•", "1.", "1)") and bold markers.
 */
export function parseSummaryBullets(summary: string): string[] {
  return summary
    .split("\n")
    .map((line) => line.trim())
    .map((line) => line.replace(/^([-*\u2022]|\d+[.)])\s+/, ""))
    .map((line) => line.replace(/\*\*|__/g, ""))
    .filter((line) => line.length > 0);
}

/** Plain-text version used by the Copy button. */
export function bulletsToText(bullets: string[]): string {
  return bullets.map((bullet) => `- ${bullet}`).join("\n");
}
