import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { aiSummaryRequests } from "@/db/schema";

export const SUMMARY_LIMIT_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000;

/**
 * Returns true and records the attempt if the user is under their hourly
 * limit; returns false (and records nothing) if they've hit it.
 * Count-then-insert can overshoot by a request or two under perfectly
 * simultaneous clicks, which is fine for cost protection.
 */
export async function consumeSummaryQuota(userId: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);

  const [row] = await db
    .select({ used: sql<number>`count(*)::int` })
    .from(aiSummaryRequests)
    .where(
      and(
        eq(aiSummaryRequests.userId, userId),
        gte(aiSummaryRequests.createdAt, since),
      ),
    );

  if ((row?.used ?? 0) >= SUMMARY_LIMIT_PER_HOUR) {
    return false;
  }

  await db.insert(aiSummaryRequests).values({ userId });
  return true;
}
