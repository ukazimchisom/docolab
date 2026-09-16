import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "./status-badge";
import { DocumentActionsMenu } from "./document-actions-menu";
import type { DocumentItem } from "@/types/document";

export function DocumentGrid({ documents }: { documents: DocumentItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
        >
          <div className="absolute right-2 top-2">
            <DocumentActionsMenu
              documentId={doc.id}
              currentTitle={doc.title}
              isOwner={doc.isOwner}
            />
          </div>

          <Link href={`/documents/${doc.id}`} className="block">
            <div className="flex items-start justify-between gap-2 pr-8">
              <span className="inline-block rounded bg-accent px-2 py-0.5 text-xs font-medium text-primary">
                {doc.category}
              </span>
              <StatusBadge status={doc.status} />
            </div>

            <h3 className="mt-3 truncate text-sm font-semibold text-foreground">
              {doc.title}
            </h3>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback
                    className={`${doc.owner.avatarColor} text-[9px] text-white`}
                  >
                    {doc.owner.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] text-muted-foreground">
                  {doc.lastEditedAt}
                </span>
              </div>

              {doc.collaborators.length > 1 && (
                <div className="flex -space-x-1.5">
                  {doc.collaborators.slice(0, 3).map((c) => (
                    <Avatar key={c.id} className="h-5 w-5 border-2 border-card">
                      <AvatarFallback
                        className={`${c.avatarColor} text-[8px] text-white`}
                      >
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
