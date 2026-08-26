import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DOCUMENTS } from "@/lib/mock-data";

const RECENT = DOCUMENTS.slice(0, 4);

export function RecentDocuments() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[12px] font-semibold text-foreground">
          Recent Documents
        </h2>
        <Link
          href="/documents"
          className="text-[10px] font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {RECENT.map((doc) => (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <span className="inline-block rounded bg-accent px-2 py-0.5 text-[10px] font-medium text-primary">
              {doc.category}
            </span>

            <h3 className="mt-3 truncate text-[11px] font-semibold text-foreground">
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
              <span className="text-[10px] text-muted-foreground">
                {doc.owner.name.split(" ")[0]} · {doc.lastEditedAt}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
