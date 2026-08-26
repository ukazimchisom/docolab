import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ACTIVITY_ITEMS } from "@/lib/mock-data";

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-xs font-semibold text-foreground">Activity Feed</h2>

      <ul className="mt-4 flex flex-col gap-4">
        {ACTIVITY_ITEMS.map((item) => (
          <li key={item.id} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className={`${item.actor.avatarColor} text-[10px] text-white`}
              >
                {item.actor.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[10px] text-foreground">
                <span className="font-medium">{item.actor.name}</span>{" "}
                <span className="text-muted-foreground">{item.action}</span>{" "}
                <span className="font-medium">{item.target}</span>
              </p>
              <p className="mt-0.5 text-[7px] text-muted-foreground">
                {item.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
