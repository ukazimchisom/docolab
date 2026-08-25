"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAV_ITEMS } from "@/lib/mock-data";
import { ICON_MAP } from "./icon-map";

export function IconRail() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-16 flex-col items-center border-r border-sidebar-border bg-sidebar py-4 md:flex">
      {/* Workspace switcher */}
      <Link
        href="/dashboard"
        aria-label="Docolab workspace"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
      >
        D
      </Link>

      <nav className="mt-8 flex flex-col items-center gap-2">
        {NAV_ITEMS.map((item) => {
          const ItemIcon = ICON_MAP[item.icon];
          const isActive = pathname.startsWith(item.href);

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <ItemIcon size={20} weight={isActive ? "fill" : "regular"} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </aside>
  );
}
