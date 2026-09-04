"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  InfoIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { updateDocument } from "@/app/(app)/actions";

interface DocumentContentProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DocumentContent({
  documentId,
  initialTitle,
  initialContent,
}: DocumentContentProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isPending, startTransition] = useTransition();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [body]);

  function scheduleSave(nextTitle: string, nextBody: string) {
    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await updateDocument(documentId, {
          title: nextTitle,
          content: nextBody,
        });
        setSaveStatus(result.error ? "error" : "saved");
      });
    }, 800);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    scheduleSave(value, body);
  }

  function handleBodyChange(value: string) {
    setBody(value);
    scheduleSave(title, value);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-accent/40 px-3 py-2.5 text-sm text-foreground">
        <div className="flex items-start gap-2">
          <InfoIcon size={16} className="mt-0.5 shrink-0 text-primary" />
          <p>
            This is a temporary plain-text editor. Rich formatting and live
            collaboration are coming in a later phase.
          </p>
        </div>

        <SaveIndicator status={saveStatus} isPending={isPending} />
      </div>

      <input
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        aria-label="Document title"
        className="mt-6 w-full border-none bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
      />

      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => handleBodyChange(e.target.value)}
        aria-label="Document content"
        className="mt-4 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

function SaveIndicator({
  status,
  isPending,
}: {
  status: SaveStatus;
  isPending: boolean;
}) {
  if (status === "idle") return null;

  if (status === "saving" || isPending) {
    return (
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
        <SpinnerGapIcon size={14} className="animate-spin" />
        Saving...
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="shrink-0 text-xs text-destructive">
        Couldn&apos;t save
      </span>
    );
  }

  return (
    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
      <CheckCircleIcon size={14} className="text-emerald-600" />
      Saved
    </span>
  );
}
