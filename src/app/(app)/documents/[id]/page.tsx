import { notFound } from "next/navigation";
import { getDocumentById } from "@/lib/mock-data";
import { DocumentBreadcrumb } from "@/components/app/document-breadcrumb";
import { DocumentContent } from "@/components/app/document-content";
import { CommentsPanel } from "@/components/app/comments-panel";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { eq } from "drizzle-orm";

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;

  const [document] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id));

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:h-full lg:flex-row">
      <div className="p-6 lg:flex-1 lg:overflow-y-auto">
        <DocumentBreadcrumb
          document={{
            title: document.title,
            category: document.category,
          }}
        />
        <div className="mt-4">
          <DocumentContent
            documentId={document.id}
            initialTitle={document.title}
            initialContent={document.content ?? ""}
          />
        </div>
      </div>

      <CommentsPanel />
    </div>
  );
}
