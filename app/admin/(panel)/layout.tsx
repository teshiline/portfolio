import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { getAdminContext } from "@/lib/auth";

const links = [
  { href: "/admin", label: "一覧" },
  { href: "/admin/settings", label: "サイト設定" },
  { href: "/admin/services", label: "サービス" },
  { href: "/admin/works", label: "実績" },
  { href: "/admin/career", label: "経歴" },
  { href: "/admin/pricing", label: "料金" },
  { href: "/admin/inquiries", label: "問い合わせ" },
];

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const context = await getAdminContext();
  if (!context.configured) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-16 md:px-6">
        <h1 className="text-[32px] font-medium leading-10">管理画面</h1>
        <p>
          Supabase の URL と公開キーを <code>.env.local</code> に入れると、ログインして内容を編集できます。
          公開ページはそれまでサンプルデータで表示します。
        </p>
        <p>
          適用する SQL は <code>supabase/migrations</code> にあります。管理者は <code>npm run create-admin</code> で作成します。
        </p>
        <Link href="/">公開サイトへ戻る</Link>
      </div>
    );
  }
  if (!context.isAdmin) redirect("/admin/login");

  return (
    <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-4 py-8 md:grid-cols-[220px_1fr] md:px-6">
      <aside className="flex flex-col gap-6">
        <nav className="flex flex-col" aria-label="管理">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex min-h-11 items-center text-ink no-underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <button type="submit" className="inline-flex min-h-11 items-center border border-line px-4">
            ログアウト
          </button>
        </form>
        <Link href="/">公開サイト</Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
