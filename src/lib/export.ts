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
export function buildMarkdownExport(title: string, html: string): string {
  const heading = `# ${title.trim() || "Untitled"}`;
  const body = htmlToMarkdown(html);
  return body ? `${heading}\n\n${body}` : `${heading}\n`;
}

export function downloadTextFile(
  fileName: string,
  content: string,
  mimeType: string,
) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
