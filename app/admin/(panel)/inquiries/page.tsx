import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "問い合わせ一覧" };

export default async function InquiriesPage() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await requireAdmin();
  const { data, error } = await supabase.from("inquiries").select("id, name, email, message, created_at").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const inquiries = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-medium leading-10">問い合わせ</h1>
      {inquiries.length === 0 ? <p>まだ受信はありません。</p> : null}
      <ul className="flex flex-col gap-4">
        {inquiries.map((inquiry) => (
          <li key={inquiry.id} className="border border-line p-6">
            <p className="text-[13px] leading-5 text-muted">
              {new Date(inquiry.created_at).toLocaleString("ja-JP")} / {inquiry.email}
            </p>
            <p className="font-medium">{inquiry.name}</p>
            <p className="mt-2 whitespace-pre-wrap">{inquiry.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
