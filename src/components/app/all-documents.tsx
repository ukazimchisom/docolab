"use client";

import { useState } from "react";
import { SquaresFourIcon, ListIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DocumentGrid } from "./document-grid";
import { DocumentTable } from "./document-table";
import type { DocumentItem } from "@/types/document";

type ViewMode = "grid" | "table";

export function AllDocuments({ documents }: { documents: DocumentItem[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          All Documents{" "}
          <span className="text-muted-foreground font-normal">
            ({documents.length})
          </span>
        </h2>

        <div
          role="group"
          aria-label="Toggle document view"
          className="flex items-center gap-0.5 rounded-lg border border-border bg-muted p-0.5"
        >
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7 shadow-none"
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
            onClick={() => setViewMode("grid")}
          >
            <SquaresFourIcon size={16} />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7 shadow-none"
            aria-pressed={viewMode === "table"}
            aria-label="Table view"
            onClick={() => setViewMode("table")}
          >
            <ListIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-3">
        {documents.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No documents yet. Create your first one from the Quick Actions
            above.
          </p>
        ) : viewMode === "grid" ? (
          <DocumentGrid documents={documents} />
        ) : (
          <DocumentTable documents={documents} />
        )}
      </div>
    </div>
  );
}
