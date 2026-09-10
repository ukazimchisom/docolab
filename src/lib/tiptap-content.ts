import type { JSONContent } from "@tiptap/react";

const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

/**
 * Documents created before rich-text editing was added store plain text
 * (or an empty string) in `content`. This safely converts whatever is in
 * the database into a valid TipTap JSON document, so old documents open
 * without crashing.
 */
export function parseDocumentContent(raw: string | null): JSONContent {
  if (!raw || raw.trim() === "") return EMPTY_DOC;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.type === "doc") {
      return parsed as JSONContent;
    }
  } catch {
    // Not JSON at all — fall through to plain-text wrapping below.
  }

  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: raw }] }],
  };
}

export function serializeDocumentContent(json: JSONContent): string {
  return JSON.stringify(json);
}
