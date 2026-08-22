import {
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  LinkIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const COLLABORATORS = [
  { initials: "SA", color: "bg-primary" },
  { initials: "CH", color: "bg-emerald-600" },
  { initials: "VI", color: "bg-amber-600" },
];

export function ProductMockup() {
  return (
    <div
      aria-hidden="true"
      className="relative rounded-xl border border-border bg-card shadow-lg"
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="text-sm font-medium text-foreground">
            Project Proposal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {COLLABORATORS.map((c) => (
              <Avatar key={c.initials} className="h-6 w-6 border-2 border-card">
                <AvatarFallback className={`${c.color} text-[10px] text-white`}>
                  {c.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-xs font-medium text-muted-foreground">+3</span>
          <button className="ml-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
            Share
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-2 text-muted-foreground">
        <span className="text-xs font-medium text-foreground">Normal</span>
        <div className="h-4 w-px bg-border" />
        <TextBIcon size={16} />
        <TextItalicIcon size={16} />
        <TextUnderlineIcon size={16} />
        <div className="h-4 w-px bg-border" />
        <ListBulletsIcon size={16} />
        <ListNumbersIcon size={16} />
        <div className="h-4 w-px bg-border" />
        <LinkIcon size={16} />
      </div>

      {/* Document body */}
      <div className="grid grid-cols-3 gap-0">
        <div className="col-span-2 space-y-4 p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Project Proposal
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Our goal is to build a scalable solution that helps teams
            collaborate more effectively and ship faster.
          </p>

          <div className="relative rounded-md bg-accent px-3 py-2">
            <span className="absolute -top-5 left-0 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              Sarah
            </span>
            <p className="text-sm text-foreground">
              This looks great! I&apos;ll add some market research here.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
              Objectives
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc pl-5">
              <li>Improve team collaboration</li>
              <li>Reduce time spent on revisions</li>
              <li>Deliver value to our users faster</li>
            </ul>
          </div>

          <div className="relative inline-block">
            <span className="absolute -bottom-5 left-0 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
              David
            </span>
          </div>
        </div>

        {/* Comment sidebar */}
        <div className="col-span-1 border-l border-border p-4">
          <div className="rounded-md border border-border bg-background p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-amber-600 text-[9px] text-white">
                  MI
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground">Mike</span>
              <span className="text-[10px] text-muted-foreground">2m ago</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Love this approach! 💪
            </p>
            <div className="mt-3 rounded border border-border px-2 py-1.5 text-[10px] text-muted-foreground">
              Reply...
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span className="text-xs text-muted-foreground">
          Sarah is editing...
        </span>
      </div>
    </div>
  );
}
