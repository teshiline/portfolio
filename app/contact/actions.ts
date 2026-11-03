"use server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type ContactState = { status: "idle" | "success" | "error"; message: string };

export async function submitInquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (String(formData.get("company_website") ?? "").trim()) {
    return { status: "success", message: "送信しました。内容を確認して連絡します。" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "名前、メール、依頼概要を入力してください。" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "メールアドレスの形式を確認してください。" };
  }
  if (message.length > 4000) {
    return { status: "error", message: "依頼概要は4000文字以内にしてください。" };
  }
  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "送信先のデータベースが未接続です。環境変数を設定すると保存できます。",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({ name, email, message });
  if (error) return { status: "error", message: "送信できませんでした。時間をおいて再度お試しください。" };
  return { status: "success", message: "送信しました。内容を確認して連絡します。" };
}
