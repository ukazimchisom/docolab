"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

interface PrintJob {
  title: string;
  html: string;
}

export function ExportMenu({
  editor,
  title,
}: {
  editor: Editor;
  title: string;
}) {
  const [printJob, setPrintJob] = useState<PrintJob | null>(null);

  useEffect(() => {
    if (!printJob) return;

    let isCancelled = false;
    const previousTitle = document.title;
    // Browsers use the page title as the default PDF file name.
    document.title = printJob.title;

    function handleAfterPrint() {
      document.title = previousTitle;
      setPrintJob(null);
    }
    window.addEventListener("afterprint", handleAfterPrint);

    // Wait for any images in the print copy to finish loading.
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(".print-only img"),
    );
    Promise.all(
      images.map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
      ),
    ).then(() => {
      if (!isCancelled) window.print();
    });

    return () => {
      isCancelled = true;
      window.removeEventListener("afterprint", handleAfterPrint);
      document.title = previousTitle;
    };
  }, [printJob]);

  function handleMarkdownExport() {
    const markdown = buildMarkdownExport(title, editor.getHTML());
    downloadTextFile(toSafeFileName(title, "md"), markdown, "text/markdown");
    toast.success("Exported as Markdown");
  }

  function handlePdfExport() {
    setPrintJob({
      title: title.trim() || "Untitled",
      html: editor.getHTML(),
    });
  }

  return (
    <>
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
          <DropdownMenuItem onSelect={handlePdfExport}>
            Print / Save as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {printJob &&
        createPortal(
          <div className="print-only bg-white text-black">
            <h1 className="mb-6 text-3xl font-bold">{printJob.title}</h1>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: printJob.html }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
