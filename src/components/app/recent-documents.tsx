import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { DocumentItem } from "@/types/document";

export function RecentDocuments({ documents }: { documents: DocumentItem[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Recent Documents
        </h2>
        <Link
          href="/documents"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      {documents.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          You haven&apos;t created any documents yet.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <span className="inline-block rounded bg-accent px-2 py-0.5 text-xs font-medium text-primary">
                {doc.category}
              </span>
              <h3 className="mt-3 truncate text-sm font-semibold text-foreground">
                {doc.title}
              </h3>
              <div className="mt-3 flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback
                    className={`${doc.owner.avatarColor} text-[9px] text-white`}
                  >
                    {doc.owner.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {doc.owner.name.split(" ")[0]} · {doc.lastEditedAt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
