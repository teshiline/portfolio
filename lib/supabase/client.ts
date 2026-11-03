import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase の環境変数が未設定です。");
  }
  return createBrowserClient(supabaseUrl(), supabaseKey());
}
