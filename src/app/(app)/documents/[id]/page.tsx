import { notFound } from "next/navigation";
import { getDocumentById } from "@/lib/mock-data";
import { DocumentBreadcrumb } from "@/components/app/document-breadcrumb";
import { CommentsPanel } from "@/components/app/comments-panel";

interface DocumentPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const document = getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex-1 overflow-y-auto p-6">
        <DocumentBreadcrumb document={document} />
        <h1 className="mt-4 text-xl font-bold text-foreground">
          {document.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Category: {document.category} · Status: {document.status}
        </p>
      </div>

      <CommentsPanel />
    </div>
  );
}
