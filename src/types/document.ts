export type DocumentStatus = "draft" | "in-progress" | "review" | "complete";

export interface Collaborator {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  status: DocumentStatus;
  owner: Collaborator;
  collaborators: Collaborator[];
  lastEditedAt: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  documentCount: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export interface Comment {
  id: string;
  author: Collaborator;
  content: string;
  timestamp: string;
  replyCount?: number;
  reactions?: { emoji: string; count: number }[];
}
