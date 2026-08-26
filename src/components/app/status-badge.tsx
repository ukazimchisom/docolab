import type { DocumentStatus } from "@/types/document";

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-amber-100 text-amber-800",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800",
  },
  review: {
    label: "Review",
    className: "bg-purple-100 text-purple-800",
  },
  complete: {
    label: "Complete",
    className: "bg-emerald-100 text-emerald-800",
  },
};

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
