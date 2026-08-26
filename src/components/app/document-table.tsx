import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "./status-badge";
import type { DocumentItem } from "@/types/document";

export function DocumentTable({ documents }: { documents: DocumentItem[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
            <th scope="col" className="px-4 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Owner
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Last Edited
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Collaborators
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="border-b border-border last:border-0 hover:bg-accent/30"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/documents/${doc.id}`}
                  className="font-medium text-[12px] text-foreground hover:text-primary hover:underline"
                >
                  {doc.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className={`${doc.owner.avatarColor} text-[10px] text-white`}
                    >
                      {doc.owner.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground text-[10px]">
                    {doc.owner.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground text-[10px]">
                {doc.lastEditedAt}
              </td>
              <td className="px-4 py-3">
                <div className="flex -space-x-1.5">
                  {doc.collaborators.slice(0, 4).map((c) => (
                    <Avatar key={c.id} className="h-6 w-6 border-2 border-card">
                      <AvatarFallback
                        className={`${c.avatarColor} text-[10px] text-white`}
                      >
                        {c.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={doc.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
