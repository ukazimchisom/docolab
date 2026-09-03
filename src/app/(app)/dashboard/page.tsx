import { createClient } from "@/lib/supabase/server";
import { getDocumentsForUser } from "@/lib/queries/documents";
import { DashboardHeader } from "@/components/app/dashboard-header";
import { QuickActions } from "@/components/app/quick-actions";
import { RecentDocuments } from "@/components/app/recent-documents";
import { AllDocuments } from "@/components/app/all-documents";
import { StorageOverview } from "@/components/app/storage-overview";
import { ActivityFeed } from "@/components/app/activity-feed";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The (app) layout already guarantees `user` exists — see Step 37 —
  // but TypeScript can't know that across files, so we guard defensively.
  const documents = user ? await getDocumentsForUser(user.id) : [];

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <DashboardHeader />
          <QuickActions />
          <RecentDocuments documents={documents.slice(0, 4)} />
          <AllDocuments documents={documents} />
        </div>

        <div className="flex flex-col gap-6">
          <StorageOverview />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
