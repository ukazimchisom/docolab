"use client";

import { useEffect, useRef, useState } from "react";
import { InfoIcon } from "@phosphor-icons/react";
import type { DocumentItem } from "@/types/document";

const PLACEHOLDER_BODY = `Our goal is to build a scalable solution that helps teams collaborate more effectively and ship faster.

Objectives
- Improve team collaboration
- Reduce time spent on revisions
- Deliver value to our users faster

Start writing here...`;

export function DocumentContent({ document }: { document: DocumentItem }) {
  const [title, setTitle] = useState(document.title);
  const [body, setBody] = useState(PLACEHOLDER_BODY);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [body]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-accent/40 px-3 py-2.5 text-sm text-foreground">
        <InfoIcon size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>
          This is a temporary plain-text editor. Rich formatting, live
          collaboration, and auto-save are coming in a later phase.
        </p>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Document title"
        className="mt-6 w-full border-none bg-transparent text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
      />

      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        aria-label="Document content"
        className="mt-4 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
