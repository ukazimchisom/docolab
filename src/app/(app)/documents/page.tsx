import { createClient } from "@/lib/supabase/server";
import { getDocumentsForUser } from "@/lib/queries/documents";
import { AllDocuments } from "@/components/app/all-documents";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const documents = user ? await getDocumentsForUser(user.id) : [];

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-foreground">Documents</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every document you own or have been given access to.
      </p>
      <div className="mt-6">
        <AllDocuments documents={documents} />
      </div>
    </div>
  );
}
