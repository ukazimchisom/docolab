import { notFound } from "next/navigation";
import { DocumentBreadcrumb } from "@/components/app/document-breadcrumb";
import { DocumentContent } from "@/components/app/document-content";
import { CommentsPanel } from "@/components/app/comments-panel";
import { ShareDialog } from "@/components/app/share-dialog";
import { db } from "@/db";
import { documents, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCommentsForDocument } from "@/lib/queries/comments";
import { createClient } from "@/lib/supabase/server";

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [currentUserProfile] = user
    ? await db.select().from(profiles).where(eq(profiles.id, user.id))
    : [];

  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id));

  if (!document) {
    notFound();
  }

  const comments = await getCommentsForDocument(document.id);

  const collaboratorRows = await db.query.documents.findFirst({
    where: eq(documents.id, document.id),
    with: {
      owner: true,
      collaborators: { with: { user: true } },
    },
  });

  const collaborators = collaboratorRows
    ? [
        {
          id: collaboratorRows.owner.id,
          name: collaboratorRows.owner.fullName,
          initials: collaboratorRows.owner.initials,
          avatarColor: collaboratorRows.owner.avatarColor,
        },
        ...collaboratorRows.collaborators.map((c) => ({
          id: c.user.id,
          name: c.user.fullName,
          initials: c.user.initials,
          avatarColor: c.user.avatarColor,
        })),
      ]
    : [];

  return (
    <div className="flex flex-col lg:h-full lg:flex-row">
      <div className="p-6 lg:flex-1 lg:overflow-y-auto">
        <div className="flex items-center justify-between">
          <DocumentBreadcrumb
            document={{ title: document.title, category: document.category }}
          />
          <ShareDialog
            documentId={document.id}
            initialCollaborators={collaborators}
          />
        </div>
        <div className="mt-4">
          <DocumentContent
            documentId={document.id}
            initialTitle={document.title}
            initialContent={document.content ?? ""}
            currentUser={{
              id: user!.id,
              name: currentUserProfile?.fullName ?? "You",
              initials: currentUserProfile?.initials ?? "U",
              avatarColor: currentUserProfile?.avatarColor ?? "bg-primary",
            }}
          />
        </div>
      </div>

      <CommentsPanel
        documentId={document.id}
        initialComments={comments}
        knownCollaborators={collaborators}
      />
    </div>
  );
}
