import Link from "next/link";
import {
  FilePlusIcon,
  FolderPlusIcon,
  CheckSquareIcon,
  NoteIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { createDocument } from "@/app/(app)/actions";

const TILE_CLASSES =
  "flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-accent/40";

interface QuickActionLink {
  label: string;
  description: string;
  href: string;
  icon: Icon;
}

const LINK_ACTIONS: QuickActionLink[] = [
  {
    label: "Create Folder",
    description: "Organize documents",
    href: "/documents/folder/new",
    icon: FolderPlusIcon,
  },
  {
    label: "Create Task List",
    description: "Create for tracking tasks",
    href: "/documents/new?type=tasklist",
    icon: CheckSquareIcon,
  },
  {
    label: "Quick Note",
    description: "Create a fast note",
    href: "/documents/new?type=note",
    icon: NoteIcon,
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <form action={createDocument}>
        <button type="submit" className={`${TILE_CLASSES} w-full`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
            <FilePlusIcon size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              New Document
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Start writing a new doc
            </p>
          </div>
        </button>
      </form>

      {LINK_ACTIONS.map((action) => (
        <Link key={action.label} href={action.href} className={TILE_CLASSES}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
            <action.icon size={18} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {action.label}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {action.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
