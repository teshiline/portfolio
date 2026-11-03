import Link from "next/link";
import { getPortfolio } from "@/lib/data";

export const metadata = { title: "管理" };

export default async function AdminHomePage() {
  const { services, works, career, pricing } = await getPortfolio(true);

  const counts = [
    ["サービス", services.length, "/admin/services"],
    ["実績", works.length, "/admin/works"],
    ["経歴", career.length, "/admin/career"],
    ["料金", pricing.length, "/admin/pricing"],
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-medium leading-10">コンテンツ</h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {counts.map(([label, count, href]) => (
          <li key={href} className="border border-line p-6">
            <Link href={href} className="text-ink no-underline">
              <span className="block text-muted">{label}</span>
              <span className="text-2xl font-medium leading-8">{count}件</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
