import { DashboardHeader } from "@/components/app/dashboard-header";
import { QuickActions } from "@/components/app/quick-actions";
import { RecentDocuments } from "@/components/app/recent-documents";
import { AllDocuments } from "@/components/app/all-documents";
import { StorageOverview } from "@/components/app/storage-overview";
import { ActivityFeed } from "@/components/app/activity-feed";

export default function DashboardPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2">
          <DashboardHeader />
          <QuickActions />
          <RecentDocuments />
          <AllDocuments />
        </div>

        <div className="flex flex-col gap-6">
          <ActivityFeed />
          <StorageOverview />
        </div>
      </div>
    </div>
  );
}
