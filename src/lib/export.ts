import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
});

export function htmlToMarkdown(html: string): string {
  const markdown = turndown.turndown(html).trim();
  return markdown ? `${markdown}\n` : "";
}

export function toSafeFileName(title: string, extension: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "untitled"}.${extension}`;
}
