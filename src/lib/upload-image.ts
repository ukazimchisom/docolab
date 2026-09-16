import { createClient } from "@/lib/supabase/client";

export async function uploadDocumentImage(
  file: File,
  documentId: string,
): Promise<{ url?: string; error?: string }> {
  if (!file.type.startsWith("image/")) {
    return { error: "Please select an image file." };
  }

  const MAX_SIZE_MB = 5;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { error: `Image must be smaller than ${MAX_SIZE_MB}MB.` };
  }

  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${documentId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("document-images")
    .upload(fileName, file);

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("document-images").getPublicUrl(fileName);

  return { url: publicUrl };
}
