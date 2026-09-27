import { createClient } from "@/lib/supabase/server";
import { getDocumentsForUser } from "@/lib/queries/documents";
import { AllDocuments } from "@/components/app/all-documents";

export default async function RecentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const documents = user ? await getDocumentsForUser(user.id) : [];
  const recent = documents.slice(0, 10);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold text-foreground">Recent</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your 10 most recently edited documents.
      </p>
      <div className="mt-6">
        <AllDocuments documents={recent} />
      </div>
    </div>
  );
}
