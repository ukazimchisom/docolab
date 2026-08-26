"use client";

import { useState } from "react";
import { SquaresFourIcon, ListIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DocumentGrid } from "./document-grid";
import { DocumentTable } from "./document-table";
import { DOCUMENTS } from "@/lib/mock-data";

type ViewMode = "grid" | "table";

export function AllDocuments() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          All Documents{" "}
          <span className="text-muted-foreground font-normal">
            ({DOCUMENTS.length})
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
        {viewMode === "grid" ? (
          <DocumentGrid documents={DOCUMENTS} />
        ) : (
          <DocumentTable documents={DOCUMENTS} />
        )}
      </div>
    </div>
  );
}
