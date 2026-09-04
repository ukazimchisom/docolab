"use client";

import { useState, useTransition } from "react";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { addComment } from "@/app/(app)/actions";
import type { Comment } from "@/types/document";

interface CommentsPanelProps {
  documentId: string;
  initialComments: Comment[];
}

export function CommentsPanel({
  documentId,
  initialComments,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    setError(null);
    startTransition(async () => {
      const result = await addComment(documentId, trimmed);

      if (result.error || !result.comment) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      setComments((prev) => [...prev, result.comment]);
      setDraft("");
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <aside className="flex w-full flex-col border-t border-border lg:h-full lg:w-80 lg:border-l lg:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">
          Comments{" "}
          <span className="font-normal text-muted-foreground">
            ({comments.length})
          </span>
        </h2>
      </div>

      <div className="px-4 py-4 lg:flex-1 lg:overflow-y-auto">
        <div className="flex flex-col gap-5">
          {comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No comments yet. Start the conversation below.
            </p>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write something..."
          aria-label="Write a comment"
          className="min-h-16 resize-none"
        />
        {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!draft.trim() || isPending}
            aria-label="Post comment"
          >
            <PaperPlaneTiltIcon size={14} />
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
