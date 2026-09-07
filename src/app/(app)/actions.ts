"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import {
  documents,
  comments as commentsTable,
  profiles,
  documentCollaborators,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createDocument() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [newDocument] = await db
    .insert(documents)
    .values({
      title: "Untitled Document",
      category: "General",
      status: "draft",
      ownerId: user.id,
    })
    .returning({ id: documents.id });

  redirect(`/documents/${newDocument.id}`);
}

export async function updateDocument(
  documentId: string,
  data: { title?: string; content?: string },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const [existing] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!existing) {
    return { error: "Document not found." };
  }

  const isOwner = existing.ownerId === user.id;

  const [collaboratorRecord] = isOwner
    ? []
    : await db
        .select()
        .from(documentCollaborators)
        .where(
          and(
            eq(documentCollaborators.documentId, documentId),
            eq(documentCollaborators.userId, user.id),
            eq(documentCollaborators.role, "editor"),
          ),
        );

  if (!isOwner && !collaboratorRecord) {
    return { error: "You don't have permission to edit this document." };
  }

  await db
    .update(documents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(documents.id, documentId));

  return { success: true };
}

export async function addComment(documentId: string, content: string) {
  const trimmed = content.trim();
  if (!trimmed) {
    return { error: "Comment cannot be empty." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const [existingDoc] = await db
    .select({ ownerId: documents.ownerId })
    .from(documents)
    .where(eq(documents.id, documentId));

  if (!existingDoc) {
    return { error: "Document not found." };
  }

  const isOwner = existingDoc.ownerId === user.id;

  const [collaboratorRecord] = isOwner
    ? []
    : await db
        .select()
        .from(documentCollaborators)
        .where(
          and(
            eq(documentCollaborators.documentId, documentId),
            eq(documentCollaborators.userId, user.id),
            eq(documentCollaborators.role, "editor"),
          ),
        );

  if (!isOwner && !collaboratorRecord) {
    return { error: "You don't have permission to comment on this document." };
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id));

  const collaboratorRows = await db
    .select({ userId: documentCollaborators.userId })
    .from(documentCollaborators)
    .where(eq(documentCollaborators.documentId, documentId));

  const authorizedUserIds = [
    existingDoc.ownerId,
    ...collaboratorRows.map((c) => c.userId),
  ];

  const [newComment] = await db
    .insert(commentsTable)
    .values({
      documentId,
      authorId: user.id,
      ownerId: existingDoc.ownerId,
      authorizedUserIds,
      content: trimmed,
    })
    .returning();

  return {
    success: true,
    comment: {
      id: newComment.id,
      author: {
        id: user.id,
        name: profile?.fullName ?? "Unknown User",
        initials: profile?.initials ?? "U",
        avatarColor: profile?.avatarColor ?? "bg-primary",
      },
      content: newComment.content,
      timestamp: "Just now",
    },
  };
}
