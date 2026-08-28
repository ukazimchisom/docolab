import { notFound } from "next/navigation";
import { getDocumentById } from "@/lib/mock-data";

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
    <div className="p-6">
      <h1 className="text-xl font-bold text-foreground">{document.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Category: {document.category} · Status: {document.status}
      </p>
    </div>
  );
}
