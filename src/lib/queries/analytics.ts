import { db } from "@/db";
import {
  documents,
  documentCollaborators,
  comments,
  profiles,
} from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import type { DocumentStatus } from "@/types/document";

export interface AnalyticsData {
  totalDocuments: number;
  statusBreakdown: { status: DocumentStatus; count: number }[];
  totalCollaboratorsGiven: number;
  totalCommentsAuthored: number;
  memberSince: Date | null;
}

export async function getAnalyticsForUser(
  userId: string,
): Promise<AnalyticsData> {
  const [totalDocsResult] = await db
    .select({ count: count() })
    .from(documents)
    .where(eq(documents.ownerId, userId));

  const statusRows = await db
    .select({ status: documents.status, count: count() })
    .from(documents)
    .where(eq(documents.ownerId, userId))
    .groupBy(documents.status);

  const [collaboratorsResult] = await db
    .select({ count: count() })
    .from(documentCollaborators)
    .innerJoin(documents, eq(documentCollaborators.documentId, documents.id))
    .where(eq(documents.ownerId, userId));

  const [commentsResult] = await db
    .select({ count: count() })
    .from(comments)
    .where(eq(comments.authorId, userId));

  const [profile] = await db
    .select({ createdAt: profiles.createdAt })
    .from(profiles)
    .where(eq(profiles.id, userId));

  return {
    totalDocuments: totalDocsResult?.count ?? 0,
    statusBreakdown: statusRows,
    totalCollaboratorsGiven: collaboratorsResult?.count ?? 0,
    totalCommentsAuthored: commentsResult?.count ?? 0,
    memberSince: profile?.createdAt ?? null,
  };
}
