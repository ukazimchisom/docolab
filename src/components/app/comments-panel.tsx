"use client";

import { useEffect, useState, useTransition } from "react";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { addComment } from "@/app/(app)/actions";
import { createClient } from "@/lib/supabase/client";
import type { Comment, Collaborator } from "@/types/document";

interface CommentsPanelProps {
  documentId: string;
  initialComments: Comment[];
  knownCollaborators: Collaborator[];
}

export function CommentsPanel({
  documentId,
  initialComments,
  knownCollaborators,
}: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    let isCancelled = false;

    const channel = supabase.channel(`comments-${documentId}`);

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `document_id=eq.${documentId}`,
      },
      async (payload) => {
        const newRow = payload.new as {
          id: string;
          author_id: string;
          content: string;
        };

        const knownAuthor = knownCollaborators.find(
          (c) => c.id === newRow.author_id,
        );

        const newComment: Comment = {
          id: newRow.id,
          author: knownAuthor ?? {
            id: newRow.author_id,
            name: "Unknown User",
            initials: "U",
            avatarColor: "bg-primary",
          },
          content: newRow.content,
          timestamp: "Just now",
        };

        setComments((prev) => {
          if (prev.some((c) => c.id === newComment.id)) return prev;
          return [...prev, newComment];
        });
        setNewIds((prev) => new Set(prev).add(newComment.id));
      },
    );

    async function subscribeWithAuth() {
      const { data } = await supabase.auth.getSession();
      if (isCancelled) return; // effect was cleaned up while we were awaiting
      if (data.session) {
        supabase.realtime.setAuth(data.session.access_token);
      }
      channel.subscribe();
    }

    subscribeWithAuth();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" && session) {
        supabase.realtime.setAuth(session.access_token);
      }
    });

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
      authSubscription.unsubscribe();
    };
  }, [documentId, knownCollaborators]);

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

      setComments((prev) => {
        if (prev.some((c) => c.id === result.comment!.id)) return prev;
        return [...prev, result.comment!];
      });
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
              <div
                key={comment.id}
                className={
                  newIds.has(comment.id)
                    ? "animate-in fade-in slide-in-from-bottom-1 duration-300"
                    : undefined
                }
              >
                <CommentItem comment={comment} />
              </div>
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
