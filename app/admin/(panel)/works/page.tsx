import Link from "next/link";
import { engagementLabel } from "@/lib/constants";
import { getPortfolio } from "@/lib/data";

export const metadata = { title: "実績管理" };

export default async function AdminWorksPage() {
  const { works } = await getPortfolio(true);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[32px] font-medium leading-10">実績</h1>
        <Link href="/admin/works/new" className="inline-flex min-h-11 items-center bg-accent px-4 text-white no-underline">
          追加する
        </Link>
      </div>
      <ul className="flex flex-col">
        {works.map((work) => (
          <li key={work.id} className="border-t border-line py-4">
            <Link href={`/admin/works/${work.id}`} className="text-ink no-underline">
              <span className="block font-medium">{work.title}</span>
              <span className="text-[13px] leading-5 text-muted">
                {work.industry} / {engagementLabel(work.engagement_type)} / {work.published ? "公開" : "非公開"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
