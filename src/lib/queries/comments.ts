import { db } from "@/db";
import { comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Comment } from "@/types/document";

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

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
