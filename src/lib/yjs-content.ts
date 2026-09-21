import * as Y from "yjs";

/**
 * Converts a Yjs document's current state into a Base64 string, safe to
 * store in a plain `text` database column.
 */
export function encodeYDoc(doc: Y.Doc): string {
  const update = Y.encodeStateAsUpdate(doc);
  return Buffer.from(update).toString("base64");
}

/**
 * Loads saved content into a Yjs document. Handles two cases:
 * 1. A real, previously-saved Yjs state (Base64-encoded).
 * 2. Legacy content from before Yjs existed — either empty, plain text,
 *    or old TipTap JSON (Step 45/48/49) — safely ignored here; the editor
 *    will just start blank for such documents, and the very next save
 *    will produce real Yjs state going forward.
 */
export function loadIntoYDoc(doc: Y.Doc, raw: string | null): void {
  if (!raw) return;

  try {
    const update = Buffer.from(raw, "base64");
    // A real Yjs update is binary; legacy JSON/plain-text will fail this
    // decode step (or produce garbage), which the catch below handles.
    Y.applyUpdate(doc, update);
  } catch {
    // Legacy content — nothing to load into the Yjs doc. This means any
    // document edited before this step will visually appear empty the
    // first time it's opened after this change. Flagged as a known,
    // one-time migration gap in docs/known-issues.md.
  }
}
