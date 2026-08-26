import { DashboardHeader } from "@/components/app/dashboard-header";
import { QuickActions } from "@/components/app/quick-actions";
import { RecentDocuments } from "@/components/app/recent-documents";
import { AllDocuments } from "@/components/app/all-documents";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <DashboardHeader />
      <QuickActions />
      <RecentDocuments />
      <AllDocuments />
    </div>
  );
}
