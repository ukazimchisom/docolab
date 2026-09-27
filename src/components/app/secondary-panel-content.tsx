"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { DocumentItem } from "@/types/document";

// Matches "/documents/<uuid>", but NOT "/documents" or "/documents/new".
const DOCUMENT_ID_PATTERN = /^\/documents\/(?!new$)([^/]+)$/;

export function SecondaryPanelContent({
  recentDocuments,
}: {
  recentDocuments: DocumentItem[];
}) {
  const pathname = usePathname();
  const activeDocId = pathname.match(DOCUMENT_ID_PATTERN)?.[1] ?? null;
  const activeDocument = recentDocuments.find((d) => d.id === activeDocId);

  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-5">
      <h2 className="px-2 text-lg font-semibold text-sidebar-foreground">
        Documents
      </h2>

      <div className="mt-4">
        <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
          Last Updates
        </h3>
        <div className="mt-1 flex flex-col gap-0.5">
          {recentDocuments.length === 0 ? (
            <p className="px-2 py-2 text-sm text-sidebar-foreground/50">
              No documents yet.
            </p>
          ) : (
            recentDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                aria-current={doc.id === activeDocId ? "page" : undefined}
                className={`truncate rounded-md px-2 py-2 text-sm transition-colors ${
                  doc.id === activeDocId
                    ? "bg-sidebar-accent font-medium text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                {doc.title}
              </Link>
            ))
          )}
        </div>
      </div>

      {activeDocument && (
        <>
          <div className="my-4 border-t border-sidebar-border" />
          <div>
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Active Collaborators
            </h3>
            <div className="mt-2 flex flex-col gap-2 px-2">
              {[activeDocument.owner, ...activeDocument.collaborators].map(
                (collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback
                        className={`${collaborator.avatarColor} text-[10px] text-white`}
                      >
                        {collaborator.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-sidebar-foreground">
                      {collaborator.name}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
