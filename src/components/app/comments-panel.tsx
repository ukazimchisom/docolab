"use client";

import { useState } from "react";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { COMMENTS, COLLABORATORS } from "@/lib/mock-data";
import type { Comment } from "@/types/document";

// Stand-in for the real logged-in user until authentication exists.
const CURRENT_USER = COLLABORATORS[0];

export function CommentsPanel() {
  const [comments, setComments] = useState<Comment[]>(COMMENTS);
  const [draft, setDraft] = useState("");

  function handleSubmit() {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newComment: Comment = {
      // Date.now() is a temporary client-side stand-in for a real
      // database-generated ID once Supabase is integrated.
      id: `temp-${Date.now()}`,
      author: CURRENT_USER,
      content: trimmed,
      timestamp: "Just now",
    };

    setComments([...comments, newComment]);
    setDraft("");
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
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
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
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!draft.trim()}
            aria-label="Post comment"
          >
            <PaperPlaneTiltIcon size={14} />
            Post
          </Button>
        </div>
      </div>
    </aside>
  );
}
