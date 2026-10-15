"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import * as Y from "yjs";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Image as TipTapImage } from "@tiptap/extension-image";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CheckCircleIcon, SpinnerGapIcon } from "@phosphor-icons/react";
import { updateDocument } from "@/app/(app)/actions";
import { encodeYDoc, loadIntoYDoc } from "@/lib/yjs-content";
import { EditorToolbar } from "./editor-toolbar";
import { useYjsSync } from "@/lib/hooks/use-yjs-sync";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Collaborator } from "@/types/document";
import { useRouter } from "next/navigation";
import { ExportMenu } from "./export-menu";
import { SummarizeButton } from "@/components/app/summarize-button";

interface DocumentContentProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  currentUser: Collaborator;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DocumentContent({
  documentId,
  initialTitle,
  initialContent,
  currentUser,
}: DocumentContentProps) {
  const [title, setTitle] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // Always-current title, readable from effects that don't re-run on every render.
  const titleRef = useRef(initialTitle);
  const titleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Created once, on first render, and kept for the component's lifetime.
  // React runs this initializer only once and ignores it afterwards.
  const [ydoc] = useState(() => {
    const doc = new Y.Doc();
    loadIntoYDoc(doc, initialContent);
    return doc;
  });

  const { presentUsers, status } = useYjsSync(documentId, ydoc, currentUser);

  function scheduleSave(nextTitle: string, saveContent: boolean) {
    setSaveStatus("saving");
    startTransition(async () => {
      const result = await updateDocument(documentId, {
        title: nextTitle,
        ...(saveContent ? { content: encodeYDoc(ydoc) } : {}),
      });
      setSaveStatus(result.error ? "error" : "saved");
      if (!result.error && !saveContent) router.refresh();
    });
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ undoRedo: false }), // Yjs replaces built-in undo/redo
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TipTapImage.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      Collaboration.configure({ document: ydoc }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] text-foreground [&_a]:text-primary [&_a]:underline",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    let timeout: ReturnType<typeof setTimeout>;

    function handleUpdate() {
      clearTimeout(timeout);
      setSaveStatus("saving");
      timeout = setTimeout(() => {
        if (!editor) return;
        scheduleSave(titleRef.current, true);
      }, 2000);
    }

    editor.on("update", handleUpdate);
    return () => {
      clearTimeout(timeout);
      editor.off("update", handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  function handleTitleChange(value: string) {
    setTitle(value);
    titleRef.current = value;
    setSaveStatus("saving");
    clearTimeout(titleTimeoutRef.current);
    titleTimeoutRef.current = setTimeout(
      () => scheduleSave(titleRef.current, false),
      2000,
    );
  }

  if (!editor) return null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-accent/40 px-3 py-2.5 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              status === "connected"
                ? "bg-emerald-500"
                : "bg-muted-foreground/40"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {status === "connected" ? "Live" : "Connecting..."}
          </span>
          {presentUsers.length > 0 && (
            <div className="ml-2 flex -space-x-1.5">
              {presentUsers.map((u) => (
                <Avatar key={u.id} className="h-5 w-5 border-2 border-card">
                  <AvatarFallback
                    className={`${u.avatarColor} text-[8px] text-white`}
                  >
                    {u.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator status={saveStatus} isPending={isPending} />
          <SummarizeButton
            documentId={documentId}
            disabled={saveStatus === "saving"}
          />
          <ExportMenu editor={editor} title={title} />
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        aria-label="Document title"
        className="mt-6 w-full border-none bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
      />

      <div className="mt-4">
        <EditorToolbar editor={editor} documentId={documentId} />
        <EditorContent editor={editor} className="mt-3" />
      </div>
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
