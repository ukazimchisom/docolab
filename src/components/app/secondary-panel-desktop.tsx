import { SecondaryPanelContent } from "./secondary-panel-content";

export function SecondaryPanelDesktop() {
  return (
    <aside className="hidden h-full w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex lg:w-62">
      <SecondaryPanelContent />
    </aside>
  );
}
