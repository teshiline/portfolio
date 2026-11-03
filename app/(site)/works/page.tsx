import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/WorkCard";
import { ENGAGEMENT_TYPES } from "@/lib/constants";
import { getPortfolio } from "@/lib/data";

export const metadata: Metadata = {
  title: "制作実績",
  description: "LINE公式アカウントの構築・運用実績です。業種、依頼種別、利用ツールで絞り込めます。",
};

export default async function WorksPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string; engagement?: string; tool?: string }>;
}) {
  const query = await searchParams;
  const { works } = await getPortfolio();
  const industries = [...new Set(works.map((work) => work.industry).filter(Boolean))];
  const tools = [...new Set(works.flatMap((work) => work.tools))];
  const filtered = works.filter((work) => {
    if (query.industry && work.industry !== query.industry) return false;
    if (query.engagement && work.engagement_type !== query.engagement) return false;
    if (query.tool && !work.tools.includes(query.tool)) return false;
    return true;
  });

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
      <header className="max-w-3xl">
        <h1 className="text-[32px] font-medium leading-10">制作実績</h1>
        <p className="mt-4">業種、依頼種別、使ったツールが近い案件から確認できます。</p>
      </header>
      <form method="get" className="flex flex-wrap items-end gap-4 border border-line p-4">
        <label className="flex min-w-40 flex-col gap-1 text-[13px] leading-5 text-muted">
          業種
          <select name="industry" defaultValue={query.industry ?? ""} className="min-h-11 border border-line bg-bg px-3 text-base text-ink">
            <option value="">すべて</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-40 flex-col gap-1 text-[13px] leading-5 text-muted">
          依頼種別
          <select name="engagement" defaultValue={query.engagement ?? ""} className="min-h-11 border border-line bg-bg px-3 text-base text-ink">
            <option value="">すべて</option>
            {ENGAGEMENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-40 flex-col gap-1 text-[13px] leading-5 text-muted">
          ツール
          <select name="tool" defaultValue={query.tool ?? ""} className="min-h-11 border border-line bg-bg px-3 text-base text-ink">
            <option value="">すべて</option>
            {tools.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center bg-accent px-4 text-white">
          絞り込む
        </button>
        <Link href="/works" className="inline-flex min-h-11 items-center px-2">
          クリア
        </Link>
      </form>
      {filtered.length === 0 ? (
        <p>条件に合う実績はまだありません。</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  );
}
