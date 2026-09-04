import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { DocumentItem, Collaborator } from "@/types/document";
import { formatRelativeTime } from "@/lib/format";

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
