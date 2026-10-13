import * as Y from "yjs";

// Block-level nodes that should end with a line break.
const BLOCK_NODES = new Set(["paragraph", "heading", "codeBlock"]);

function nodeToText(node: unknown): string {
  if (node instanceof Y.XmlText) {
    return node
      .toDelta()
      .map((op: { insert?: unknown }) =>
        typeof op.insert === "string" ? op.insert : "",
      )
      .join("");
  }

  if (node instanceof Y.XmlElement) {
    if (node.nodeName === "hardBreak") return "\n";
    const inner = node.toArray().map(nodeToText).join("");
    return BLOCK_NODES.has(node.nodeName) ? `${inner}\n` : inner;
  }

  return "";
}

// TipTap's Collaboration extension stores the document in the "default" field.
export function extractTextFromYDoc(doc: Y.Doc, field = "default"): string {
  const text = doc.getXmlFragment(field).toArray().map(nodeToText).join("");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}
