import { createClient } from "@/lib/supabase/server";
import { getDocumentsForUser } from "@/lib/queries/documents";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { QuickActions } from "@/components/app/quick-actions";
import { RecentDocuments } from "@/components/app/recent-documents";
import { AllDocuments } from "@/components/app/all-documents";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFirstName } from "@/lib/greeting";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The (app) layout already guarantees `user` exists — see Step 37 —
  // but TypeScript can't know that across files, so we guard defensively.
  const documents = user ? await getDocumentsForUser(user.id) : [];
  const profile = user
    ? (
        await db
          .select({ fullName: profiles.fullName })
          .from(profiles)
          .where(eq(profiles.id, user.id))
      )[0]
    : undefined;
  const firstName = getFirstName(profile?.fullName);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 lg:p-6">
      <DashboardHeader firstName={firstName} />
      <QuickActions />
      <RecentDocuments documents={documents.slice(0, 4)} />
      <AllDocuments documents={documents} />
    </div>
  );
}
