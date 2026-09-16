"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DotsThreeIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { updateDocument, deleteDocument } from "@/app/(app)/actions";
import { toast } from "sonner";

interface DocumentActionsMenuProps {
  documentId: string;
  currentTitle: string;
  isOwner?: boolean;
}

export function DocumentActionsMenu({
  documentId,
  currentTitle,
  isOwner = true,
}: DocumentActionsMenuProps) {
  const router = useRouter();
  const [renameOpen, setRenameOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(currentTitle);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRename() {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setError(null);
    startTransition(async () => {
      const result = await updateDocument(documentId, { title: trimmed });
      if (result.error) {
        setError(result.error);
        return;
      }
      setRenameOpen(false);
      toast.success("Document renamed");
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteDocument(documentId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Document deleted");
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            aria-label="Document actions"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsThreeIcon size={18} weight="bold" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => {
              setNewTitle(currentTitle);
              setRenameOpen(true);
            }}
          >
            <PencilSimpleIcon size={16} />
            Rename
          </DropdownMenuItem>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <TrashIcon size={16} />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete &quot;{currentTitle}&quot;?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this document, its comments,
                    and remove access for all collaborators. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isPending}
                    className="bg-destructive text-white hover:bg-destructive/90"
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
          </DialogHeader>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newTitle.trim() || isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
