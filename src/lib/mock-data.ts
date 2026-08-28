// TEMPORARY PLACEHOLDER DATA
// This file exists only until Supabase integration replaces it with real
// database queries. Every component consuming this data should import from
// here — never hardcode document/folder data directly inside a component.

import type {
  Collaborator,
  DocumentItem,
  Folder,
  NavItem,
  Comment,
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

export interface StorageBreakdownItem {
  label: string;
  usedGb: number;
  color: string;
}

export const STORAGE_STATS = {
  usedGb: 4.1,
  totalGb: 5,
  breakdown: [
    { label: "Documents", usedGb: 2.8, color: "text-primary" },
    { label: "Attachments", usedGb: 0.6, color: "text-amber-600" },
    { label: "Exports", usedGb: 0.7, color: "text-emerald-600" },
  ] as StorageBreakdownItem[],
};

export interface ActivityItem {
  id: string;
  actor: Collaborator;
  action: string;
  target: string;
  timestamp: string;
}

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "a1",
    actor: COLLABORATORS[2],
    action: "commented on",
    target: "Marketing Strategy Draft",
    timestamp: "1h ago",
  },
  {
    id: "a2",
    actor: COLLABORATORS[1],
    action: "created a new document",
    target: "Customer Research Notes",
    timestamp: "1h ago",
  },
  {
    id: "a3",
    actor: COLLABORATORS[3],
    action: "attached a file to",
    target: "Client Presentation Prep",
    timestamp: "1h ago",
  },
];
export const COMMENTS: Comment[] = [
  {
    id: "c1",
    author: COLLABORATORS[3],
    content:
      "Maybe we should add a section explaining how the AI suggestions actually work under the hood.",
    timestamp: "2h ago",
    replyCount: 1,
  },
  {
    id: "c2",
    author: COLLABORATORS[1],
    content:
      "The introduction is clear, but it might help to add a short real-world example.",
    timestamp: "5h ago",
  },
  {
    id: "c3",
    author: COLLABORATORS[3],
    content: "Should we include a comparison with external AI writing tools?",
    timestamp: "8h ago",
    reactions: [
      { emoji: "👍", count: 4 },
      { emoji: "👀", count: 2 },
    ],
  },
];

export function getDocumentById(id: string): DocumentItem | undefined {
  return DOCUMENTS.find((doc) => doc.id === id);
}
