"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { documents } from "@/db/schema";

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
