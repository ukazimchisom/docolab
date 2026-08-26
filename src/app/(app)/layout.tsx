import { IconRail } from "@/components/app/icon-rail";
import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { SecondaryPanelDesktop } from "@/components/app/secondary-panel-desktop";
import { TopBar } from "@/components/app/top-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <IconRail />
      <SecondaryPanelDesktop />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>

      <BottomTabBar />
    </div>
  );
}
