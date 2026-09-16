import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { DocumentItem, Collaborator } from "@/types/document";
import { formatRelativeTime } from "@/lib/format";
import { inArray } from "drizzle-orm";
import { documentCollaborators } from "@/db/schema";

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
  const ownedRows = await db.query.documents.findMany({
    where: eq(documents.ownerId, userId),
    with: {
      owner: true,
      collaborators: { with: { user: true } },
    },
  });

  const sharedWithMeRows = await db
    .select({ documentId: documentCollaborators.documentId })
    .from(documentCollaborators)
    .where(eq(documentCollaborators.userId, userId));

  const sharedDocIds = sharedWithMeRows.map((r) => r.documentId);

  const collaboratedRows = sharedDocIds.length
    ? await db.query.documents.findMany({
        where: inArray(documents.id, sharedDocIds),
        with: {
          owner: true,
          collaborators: { with: { user: true } },
        },
      })
    : [];

  const combinedRaw = [
    ...ownedRows.map((doc) => ({ doc, isOwner: true })),
    ...collaboratedRows.map((doc) => ({ doc, isOwner: false })),
  ].sort((a, b) => b.doc.updatedAt.getTime() - a.doc.updatedAt.getTime());

  return combinedRaw.map(({ doc, isOwner }) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category,
    status: doc.status,
    owner: toCollaborator(doc.owner),
    collaborators: doc.collaborators.map((c) => toCollaborator(c.user)),
    lastEditedAt: formatRelativeTime(doc.updatedAt),
    folderId: doc.folderId,
    isOwner,
  }));
}
