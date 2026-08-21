"use client";

import { useState } from "react";
import Link from "next/link";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Logo } from "./logo";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <ListIcon size={22} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] sm:w-[320px]">
          <SheetHeader>
            <SheetTitle asChild>
              <div className="flex items-center justify-between">
                <Logo />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <XIcon size={20} />
                  </Button>
                </SheetClose>
              </div>
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-8 flex flex-col gap-1 px-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-base text-foreground hover:bg-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 px-4">
            <Button asChild className="w-full" onClick={() => setOpen(false)}>
              <Link href="/signup">Start Collaborating</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
