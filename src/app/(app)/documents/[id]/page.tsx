import { notFound } from "next/navigation";
import { getDocumentById } from "@/lib/mock-data";
import { DocumentBreadcrumb } from "@/components/app/document-breadcrumb";
import { DocumentContent } from "@/components/app/document-content";
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
        <div className="mt-4">
          <DocumentContent document={document} />
        </div>
      </div>

      <CommentsPanel />
    </div>
  );
}
