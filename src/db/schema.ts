import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

// ---------- Enums ----------

export const documentStatusEnum = pgEnum("document_status", [
  "draft",
  "in-progress",
  "review",
  "complete",
]);

export const collaboratorRoleEnum = pgEnum("collaborator_role", [
  "owner",
  "editor",
  "viewer",
]);

// ---------- Tables ----------

// Extends Supabase's built-in auth.users table with app-specific profile data.
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name").notNull(),
  avatarColor: text("avatar_color").notNull().default("bg-primary"),
  initials: text("initials").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const folders = pgTable("folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  status: documentStatusEnum("status").notNull().default("draft"),
  content: text("content").default(""),
  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "set null",
  }),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const documentCollaborators = pgTable("document_collaborators", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  role: collaboratorRoleEnum("role").notNull().default("editor"),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  authorizedUserIds: uuid("authorized_user_ids").array().notNull().default([]),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

import { relations } from "drizzle-orm";

export const profilesRelations = relations(profiles, ({ many }) => ({
  documents: many(documents),
  folders: many(folders),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [folders.ownerId],
    references: [profiles.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  owner: one(profiles, {
    fields: [documents.ownerId],
    references: [profiles.id],
  }),
  folder: one(folders, {
    fields: [documents.folderId],
    references: [folders.id],
  }),
  collaborators: many(documentCollaborators),
  comments: many(comments),
}));

export const documentCollaboratorsRelations = relations(
  documentCollaborators,
  ({ one }) => ({
    document: one(documents, {
      fields: [documentCollaborators.documentId],
      references: [documents.id],
    }),
    user: one(profiles, {
      fields: [documentCollaborators.userId],
      references: [profiles.id],
    }),
  }),
);

export const commentsRelations = relations(comments, ({ one }) => ({
  document: one(documents, {
    fields: [comments.documentId],
    references: [documents.id],
  }),
  author: one(profiles, {
    fields: [comments.authorId],
    references: [profiles.id],
  }),
}));
