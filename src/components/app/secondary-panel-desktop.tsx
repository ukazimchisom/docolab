import { SecondaryPanelContent } from "./secondary-panel-content";
import type { DocumentItem } from "@/types/document";

export function SecondaryPanelDesktop({
  recentDocuments,
}: {
  recentDocuments: DocumentItem[];
}) {
  return (
    <aside className="hidden h-full w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex lg:w-42">
      <SecondaryPanelContent recentDocuments={recentDocuments} />
    </aside>
  );
}
