import { IconRail } from "@/components/app/icon-rail";
import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { SecondaryPanelDesktop } from "@/components/app/secondary-panel-desktop";
import { TopBar } from "@/components/app/top-bar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <IconRail />
      <SecondaryPanelDesktop />
      <div className="flex flex-1 flex-col">
        <TopBar />
      </div>
      <BottomTabBar />
    </div>
  );
}
