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
import {
  InfoIcon,
  CheckCircleIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import { updateDocument } from "@/app/(app)/actions";
import { encodeYDoc, loadIntoYDoc } from "@/lib/yjs-content";
import { EditorToolbar } from "./editor-toolbar";

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isPending, startTransition] = useTransition();

  // Created once per document, kept alive for the component's lifetime.
  const ydocRef = useRef<Y.Doc | null>(null);
  if (!ydocRef.current) {
    ydocRef.current = new Y.Doc();
    loadIntoYDoc(ydocRef.current, initialContent);
  }

  function scheduleSave(nextTitle: string, saveContent: boolean) {
    setSaveStatus("saving");
    startTransition(async () => {
      const result = await updateDocument(documentId, {
        title: nextTitle,
        ...(saveContent && ydocRef.current
          ? { content: encodeYDoc(ydocRef.current) }
          : {}),
      });
      setSaveStatus(result.error ? "error" : "saved");
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
      Collaboration.configure({ document: ydocRef.current }),
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
        scheduleSave(title, true);
      }, 800);
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
    setSaveStatus("saving");
    setTimeout(() => scheduleSave(value, false), 800);
  }

  if (!editor) return null;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-accent/40 px-3 py-2.5 text-sm text-foreground">
        <div className="flex items-start gap-2">
          <InfoIcon size={16} className="mt-0.5 shrink-0 text-primary" />
          <p>Live multi-user sync is being wired up in the next step.</p>
        </div>
        <SaveIndicator status={saveStatus} isPending={isPending} />
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
