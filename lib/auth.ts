import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  if (!isSupabaseConfigured()) {
    return { configured: false as const, isAdmin: false };
  }
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isAdmin =
    (data?.claims?.app_metadata as { role?: string } | undefined)?.role === "admin";
  return { configured: true as const, isAdmin, supabase };
}

export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context.configured || !context.isAdmin) {
    throw new Error("管理者としてログインしてください。");
  }
  return context.supabase;
}
