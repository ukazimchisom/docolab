import { IconRail } from "@/components/app/icon-rail";
import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { SecondaryPanelDesktop } from "@/components/app/secondary-panel-desktop";
import { SecondaryPanelMobile } from "@/components/app/secondary-panel-mobile";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <IconRail />
      <SecondaryPanelDesktop />
      <div className="p-4 md:hidden">
        <SecondaryPanelMobile />
      </div>
      <BottomTabBar />
    </div>
  );
}
