// TEMPORARY PLACEHOLDER DATA
// This file exists only until Supabase integration replaces it with real
// database queries. Every component consuming this data should import from
// here — never hardcode document/folder data directly inside a component.

import type {
  Collaborator,
  DocumentItem,
  Folder,
  NavItem,
} from "@/types/document";

export const COLLABORATORS: Collaborator[] = [
  { id: "u1", name: "Andy Rivers", initials: "AR", avatarColor: "bg-primary" },
  {
    id: "u2",
    name: "David Torres",
    initials: "DT",
    avatarColor: "bg-emerald-700",
  },
  { id: "u3", name: "Priya Nair", initials: "PN", avatarColor: "bg-amber-700" },
  {
    id: "u4",
    name: "James Sunderland",
    initials: "JS",
    avatarColor: "bg-rose-700",
  },
];

export const FOLDERS: Folder[] = [
  { id: "f1", name: "Product", documentCount: 4 },
  { id: "f2", name: "Marketing", documentCount: 6 },
  { id: "f3", name: "Operations", documentCount: 9 },
];

export const DOCUMENTS: DocumentItem[] = [
  {
    id: "d1",
    title: "Product Launch Strategy",
    category: "Product",
    status: "in-progress",
    owner: COLLABORATORS[0],
    collaborators: [COLLABORATORS[0], COLLABORATORS[1]],
    lastEditedAt: "12m ago",
    folderId: "f1",
  },
  {
    id: "d2",
    title: "Website Copy Draft",
    category: "Marketing",
    status: "draft",
    owner: COLLABORATORS[1],
    collaborators: [COLLABORATORS[1]],
    lastEditedAt: "25m ago",
    folderId: "f2",
  },
  {
    id: "d3",
    title: "Customer Interview Notes",
    category: "Operations",
    status: "in-progress",
    owner: COLLABORATORS[0],
    collaborators: [COLLABORATORS[0], COLLABORATORS[2], COLLABORATORS[3]],
    lastEditedAt: "1h ago",
    folderId: "f3",
  },
  {
    id: "d4",
    title: "AI Feature Specification",
    category: "Product",
    status: "complete",
    owner: COLLABORATORS[2],
    collaborators: [COLLABORATORS[2]],
    lastEditedAt: "2h ago",
    folderId: "f1",
  },
  {
    id: "d5",
    title: "Q2 Marketing Strategy",
    category: "Marketing",
    status: "review",
    owner: COLLABORATORS[0],
    collaborators: [COLLABORATORS[0], COLLABORATORS[1]],
    lastEditedAt: "5h ago",
    folderId: "f2",
  },
  {
    id: "d6",
    title: "Product Requirements",
    category: "Product",
    status: "review",
    owner: COLLABORATORS[1],
    collaborators: [COLLABORATORS[1]],
    lastEditedAt: "6h ago",
    folderId: "f1",
  },
];

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
  { id: "ai", label: "AI Assistant", href: "/ai", icon: "Sparkle" },
];
