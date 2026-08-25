"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CaretDownIcon,
  FolderIcon,
  ShareNetworkIcon,
  BookmarkSimpleIcon,
  ArchiveIcon,
} from "@phosphor-icons/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { FOLDERS, DOCUMENTS } from "@/lib/mock-data";

const QUICK_LINKS = [
  { label: "Shared", href: "/shared", icon: ShareNetworkIcon, count: 3 },
  { label: "Saved", href: "/saved", icon: BookmarkSimpleIcon, count: 5 },
  { label: "Archived", href: "/archived", icon: ArchiveIcon, count: 8 },
];

const RECENT_DOCUMENTS = DOCUMENTS.slice(0, 5);

export function SecondaryPanelContent() {
  const [foldersOpen, setFoldersOpen] = useState(true);

  return (
    <div className="flex h-full flex-col overflow-y-auto px-3 py-5">
      <h2 className="px-2 text-lg font-semibold text-sidebar-foreground">
        Documents
      </h2>

      {/* Folders */}
      <Collapsible
        open={foldersOpen}
        onOpenChange={setFoldersOpen}
        className="mt-6"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60 hover:text-sidebar-foreground">
          <span>Folders</span>
          <CaretDownIcon
            size={14}
            className={`transition-transform ${foldersOpen ? "rotate-0" : "-rotate-90"}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 flex flex-col gap-0.5">
          {FOLDERS.map((folder) => (
            <Link
              key={folder.id}
              href={`/documents/folder/${folder.id}`}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <span className="flex items-center gap-2">
                <FolderIcon size={16} className="text-sidebar-foreground/50" />
                {folder.name}
              </span>
              <span className="text-xs text-sidebar-foreground/50">
                {folder.documentCount}
              </span>
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-4 bg-sidebar-border" />

      {/* Last Updates */}
      <div>
        <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
          Last Updates
        </h3>
        <div className="mt-1 flex flex-col gap-0.5">
          {RECENT_DOCUMENTS.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}`}
              className="truncate rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {doc.title}
            </Link>
          ))}
        </div>
      </div>

      <Separator className="my-4 bg-sidebar-border" />

      {/* Quick links */}
      <div className="flex flex-col gap-0.5">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <span className="flex items-center gap-2">
              <link.icon size={16} className="text-sidebar-foreground/50" />
              {link.label}
            </span>
            <span className="text-xs text-sidebar-foreground/50">
              {link.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
