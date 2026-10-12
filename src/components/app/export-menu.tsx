"use client";

import type { Editor } from "@tiptap/react";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  buildMarkdownExport,
  downloadTextFile,
  toSafeFileName,
} from "@/lib/export";

export function ExportMenu({
  editor,
  title,
}: {
  editor: Editor;
  title: string;
}) {
  function handleMarkdownExport() {
    const markdown = buildMarkdownExport(title, editor.getHTML());
    downloadTextFile(toSafeFileName(title, "md"), markdown, "text/markdown");
    toast.success("Exported as Markdown");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
          <DownloadSimpleIcon size={14} />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={handleMarkdownExport}>
          Markdown (.md)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
