"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  if (existing.ownerId !== user.id) {
    return { error: "You don't have permission to edit this document." };
  }

  await db
    .update(documents)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(documents.id, documentId));

  return { success: true };
}
