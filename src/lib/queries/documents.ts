import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { DocumentItem, Collaborator } from "@/types/document";

function toCollaborator(profile: {
  id: string;
  fullName: string;
  initials: string;
  avatarColor: string;
}): Collaborator {
  return {
    id: profile.id,
    name: profile.fullName,
    initials: profile.initials,
    avatarColor: profile.avatarColor,
  };
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

export async function getDocumentsForUser(
  userId: string,
): Promise<DocumentItem[]> {
  const rows = await db.query.documents.findMany({
    where: eq(documents.ownerId, userId),
    orderBy: (documents, { desc }) => [desc(documents.updatedAt)],
    with: {
      owner: true,
      collaborators: {
        with: { user: true },
      },
    },
  });

  return rows.map((doc) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    status: doc.status,
    owner: toCollaborator(doc.owner),
    collaborators: doc.collaborators.map((c) => toCollaborator(c.user)),
    lastEditedAt: formatRelativeTime(doc.updatedAt),
    folderId: doc.folderId,
  }));
}
