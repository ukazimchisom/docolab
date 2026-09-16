"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FOLDERS, DOCUMENTS, getDocumentById } from "@/lib/mock-data";

const QUICK_LINKS = [
  { label: "Shared", href: "/shared", icon: ShareNetworkIcon, count: 3 },
  { label: "Saved", href: "/saved", icon: BookmarkSimpleIcon, count: 5 },
  { label: "Archived", href: "/archived", icon: ArchiveIcon, count: 8 },
];

const RECENT_DOCUMENTS = DOCUMENTS.slice(0, 5);

// Matches "/documents/d1", but NOT "/documents", "/documents/new",
// or "/documents/folder/f1" — only a genuinely open, specific document.
const DOCUMENT_ID_PATTERN = /^\/documents\/(?!new$|folder\/)([^/]+)$/;

export function SecondaryPanelContent() {
  const [foldersOpen, setFoldersOpen] = useState(true);
  const pathname = usePathname();

  const activeDocId = pathname.match(DOCUMENT_ID_PATTERN)?.[1] ?? null;
  const activeDocument = activeDocId ? getDocumentById(activeDocId) : undefined;

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
              className="flex items-center justify-between rounded-md px-2 py-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
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
              aria-current={doc.id === activeDocId ? "page" : undefined}
              className={`truncate rounded-md px-2 py-2 text-xs transition-colors ${
                doc.id === activeDocId
                  ? "bg-sidebar-accent font-medium text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
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
            className="flex items-center justify-between rounded-md px-2 py-2 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
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

      {/* Active Collaborators — only while a specific document is open */}
      {activeDocument && (
        <>
          <Separator className="my-4 bg-sidebar-border" />
          <div>
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Active Collaborators
            </h3>
            <div className="mt-2 flex flex-col gap-2 px-2">
              {activeDocument.collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center gap-2">
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
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
