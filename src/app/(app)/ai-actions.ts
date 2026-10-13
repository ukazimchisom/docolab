"use server";

import * as Y from "yjs";
import { eq, and } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { documents, documentCollaborators } from "@/db/schema";
import { loadIntoYDoc } from "@/lib/yjs-content";
import { extractTextFromYDoc } from "@/lib/ai/extract-text";
import {
  prepareSummaryInput,
  buildSummaryPrompt,
} from "@/lib/ai/summary-input";
import { generateSummary } from "@/lib/ai/gemini";
import {
  consumeSummaryQuota,
  SUMMARY_LIMIT_PER_HOUR,
} from "@/lib/ai/rate-limit";

export type SummarizeResult =
  | { ok: true; summary: string; truncated: boolean }
  | { ok: false; error: string };

export async function summarizeDocument(
  documentId: string,
): Promise<SummarizeResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Please sign in again." };
  }

  const [doc] = await db
    .select({
      ownerId: documents.ownerId,
      title: documents.title,
      content: documents.content,
    })
    .from(documents)
    .where(eq(documents.id, documentId));

  // Same message for "missing" and "not yours": don't reveal which IDs exist.
  const notFound: SummarizeResult = { ok: false, error: "Document not found." };

  if (!doc) {
    return notFound;
  }

  if (doc.ownerId !== user.id) {
    const [collaborator] = await db
      .select({ id: documentCollaborators.id })
      .from(documentCollaborators)
      .where(
        and(
          eq(documentCollaborators.documentId, documentId),
          eq(documentCollaborators.userId, user.id),
        ),
      );

    if (!collaborator) {
      return notFound;
    }
  }

  const ydoc = new Y.Doc();
  loadIntoYDoc(ydoc, doc.content);
  const rawText = extractTextFromYDoc(ydoc);

  const input = prepareSummaryInput(rawText);
  if (!input.ok) {
    return {
      ok: false,
      error: `This document is too short to summarize (at least ${MIN_CHARS_HINT} characters needed).`,
    };
  }

  const allowed = await consumeSummaryQuota(user.id);
  if (!allowed) {
    return {
      ok: false,
      error: `You've reached the limit of ${SUMMARY_LIMIT_PER_HOUR} summaries per hour. Please try again later.`,
    };
  }

  const result = await generateSummary(
    buildSummaryPrompt(doc.title, input.text),
  );

  if (!result.ok) {
    return { ok: false, error: messageForError(result.error) };
  }

  return { ok: true, summary: result.summary, truncated: input.truncated };
}

const MIN_CHARS_HINT = 100;

function messageForError(code: string): string {
  switch (code) {
    case "not-configured":
      return "AI summaries aren't set up on this server yet.";
    case "rate-limited":
      return "The AI service is busy right now. Please try again in a minute.";
    case "blocked":
      return "The AI service declined to summarize this content.";
    case "empty":
      return "The AI service returned nothing. Please try again.";
    default:
      return "Something went wrong while summarizing. Please try again.";
  }
}
