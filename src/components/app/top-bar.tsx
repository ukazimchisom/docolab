"use client";

import Link from "next/link";
import {
  MagnifyingGlassIcon,
  BellIcon,
  SignOutIcon,
  UserIcon,
  GearIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SecondaryPanelMobile } from "./secondary-panel-mobile";
import { logout } from "@/app/(auth)/actions";
import { ThemeToggle } from "./theme-toggle";

interface TopBarUser {
  name: string;
  email: string;
  initials: string;
}

export function TopBar({ user }: { user: TopBarUser }) {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");

  const shortcutKey = isMac ? "⌘" : "Ctrl";

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4 lg:px-6">
      <SecondaryPanelMobile />

      <div className="relative flex-1 max-w-md">
        <MagnifyingGlassIcon
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="Search..."
          aria-label="Search documents"
          className="pl-9 pr-14"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {shortcutKey}F
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <BellIcon size={20} />
          <Badge className="absolute right-1 top-1 h-2 w-2 rounded-full p-0" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Account menu"
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon size={16} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <GearIcon size={16} />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <form action={logout} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2"
                >
                  <SignOutIcon size={16} />
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
