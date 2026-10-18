import type { NavItem } from "@/types/document";

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/dashboard", icon: "House" },
  { id: "documents", label: "Documents", href: "/documents", icon: "FileText" },
  {
    id: "recent",
    label: "Recent",
    href: "/recent",
    icon: "ClockCounterClockwise",
  },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "ChartBar" },
];
