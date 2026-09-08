"use client";

import { useState, useTransition } from "react";
import { UserPlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { inviteCollaborator } from "@/app/(app)/actions";
import type { Collaborator } from "@/types/document";

interface ShareDialogProps {
  documentId: string;
  initialCollaborators: Collaborator[];
}

export function ShareDialog({
  documentId,
  initialCollaborators,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState(initialCollaborators);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInvite() {
    const trimmed = email.trim();
    if (!trimmed) return;

    setError(null);
    startTransition(async () => {
      const result = await inviteCollaborator(documentId, trimmed);

      if (result.error || !result.collaborator) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      setCollaborators((prev) => [...prev, result.collaborator!]);
      setEmail("");
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlusIcon size={16} />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this document</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInvite()}
          />
          <Button onClick={handleInvite} disabled={!email.trim() || isPending}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="mt-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            People with access
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {collaborators.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback
                    className={`${c.avatarColor} text-[10px] text-white`}
                  >
                    {c.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
