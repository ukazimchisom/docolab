"use client";

import { useState } from "react";
import { ListIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SecondaryPanelContent } from "./secondary-panel-content";
import type { DocumentItem } from "@/types/document";

export function SecondaryPanelMobile({
  recentDocuments,
}: {
  recentDocuments: DocumentItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open documents panel"
          className="md:hidden"
        >
          <ListIcon size={22} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 sm:w-[320px]">
        <SheetHeader className="sr-only">
          <SheetTitle>Documents navigation</SheetTitle>
        </SheetHeader>
        <SecondaryPanelContent recentDocuments={recentDocuments} />
      </SheetContent>
    </Sheet>
  );
}
