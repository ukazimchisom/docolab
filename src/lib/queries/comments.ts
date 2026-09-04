import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Comment } from "@/types/document";
import { formatRelativeTime } from "@/lib/format";

export async function getCommentsForDocument(
  documentId: string,
): Promise<Comment[]> {
  const rows = await db.query.comments.findMany({
    where: eq(comments.documentId, documentId),
    orderBy: (comments, { asc }) => [asc(comments.createdAt)],
    with: { author: true },
  });

  return rows.map((row) => ({
    id: row.id,
    author: {
      id: row.author.id,
      name: row.author.fullName,
      initials: row.author.initials,
      avatarColor: row.author.avatarColor,
    },
    content: row.content,
    timestamp: formatRelativeTime(row.createdAt),
  }));
}
