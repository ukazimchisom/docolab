import { StatusBadge } from "./status-badge";
import type { DocumentStatus } from "@/types/document";

const STATUS_BAR_COLORS: Record<DocumentStatus, string> = {
  draft: "bg-amber-400",
  "in-progress": "bg-blue-400",
  review: "bg-purple-400",
  complete: "bg-emerald-400",
};

interface StatusBreakdownBarProps {
  breakdown: { status: DocumentStatus; count: number }[];
  total: number;
}

export function StatusBreakdownBar({
  breakdown,
  total,
}: StatusBreakdownBarProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">
        Documents by Status
      </h2>

      {total === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No documents yet.</p>
      ) : (
        <>
          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-muted">
            {breakdown.map((item) => (
              <div
                key={item.status}
                className={STATUS_BAR_COLORS[item.status]}
                style={{ width: `${(item.count / total) * 100}%` }}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {breakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <StatusBadge status={item.status} />
                <span className="text-sm text-muted-foreground">
                  {item.count} ({Math.round((item.count / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
