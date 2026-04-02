import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload a viand image to Supabase Storage.
 * Bucket name: "viand-images" (create this in Supabase Dashboard → Storage)
 *
 * @returns the public URL of the uploaded image
 */
export async function uploadViandImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from("viand-images")
    .upload(fileName, file, { upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from("viand-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
