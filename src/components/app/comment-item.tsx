import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Comment } from "@/types/document";

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={`${comment.author.avatarColor} text-[10px] text-white`}
        >
          {comment.author.initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-foreground">
            {comment.author.name}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {comment.timestamp}
          </span>
        </div>

        <p className="mt-0.5 text-xs text-foreground">{comment.content}</p>

        <div className="mt-1.5 flex items-center gap-3">
          {comment.replyCount ? (
            <button className="text-[10px] font-medium text-muted-foreground hover:text-foreground">
              {comment.replyCount}{" "}
              {comment.replyCount === 1 ? "reply" : "replies"}
            </button>
          ) : null}

          {comment.reactions?.map((reaction) => (
            <span
              key={reaction.emoji}
              className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {reaction.emoji} {reaction.count}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
