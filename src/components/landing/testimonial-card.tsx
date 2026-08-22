import { QuotesIcon } from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

export function TestimonialCard({
  quote,
  name,
  role,
  initials,
  avatarColor,
}: TestimonialCardProps) {
  return (
    <figure className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <QuotesIcon
        aria-hidden="true"
        size={28}
        weight="fill"
        className="text-primary/30"
      />

      <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
        {quote}
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={`${avatarColor} text-xs text-white`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
