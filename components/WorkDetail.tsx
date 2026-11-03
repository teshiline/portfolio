import Link from "next/link";
import { engagementLabel } from "@/lib/constants";
import type { Work } from "@/lib/types";
import { assetGroups, metricText, primaryResult } from "@/lib/work-display";
import { WorkGallery } from "@/components/WorkGallery";

export function WorkDetail({ work }: { work: Work }) {
  const metric = metricText(primaryResult(work));
  const facts = [
    ["ツール", work.tools.join("、")],
    ["友だち規模", `${work.friends_before || "—"} → ${work.friends_after || "—"}`],
    ["目的", work.goals.join("、")],
  ];

  return (
    <article className="mx-auto flex w-full max-w-[1120px] flex-col gap-16 px-4 py-16 md:gap-24 md:px-6 md:py-24">
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="text-[13px] leading-5 text-muted">
          {work.industry} / {engagementLabel(work.engagement_type)} / {work.period}
        </p>
        <h1 className="text-[32px] font-medium leading-10">{work.title}</h1>
        <p>{work.summary}</p>
        {work.client_label ? <p className="text-muted">{work.client_label}</p> : null}
        {metric ? <p className="text-[40px] font-medium leading-tight">{metric}</p> : null}
      </header>

      <dl className="grid gap-6 border-y border-line py-6 md:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[13px] leading-5 text-muted">{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">課題</h2>
        <p className="whitespace-pre-wrap">{work.challenge}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">制作範囲</h2>
        <ul className="grid gap-2 md:grid-cols-2">
          {work.scope_items.map((item) => (
            <li key={item} className="border border-line px-4 py-3">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex max-w-3xl flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">施策</h2>
        <p className="whitespace-pre-wrap">{work.approach}</p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">成果</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {work.results.map((result) => (
            <div key={result.id} className="border border-line p-6">
              <p className="text-[13px] leading-5 text-muted">{result.label}</p>
              <p className="text-xl font-medium leading-7">
                {result.before_value || "—"} → {result.after_value || "—"}
              </p>
              {result.display_value ? <p className="text-muted">{result.display_value}</p> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-medium leading-8">制作画像</h2>
        <WorkGallery groups={assetGroups(work)} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border border-line p-6">
          <h2 className="text-xl font-medium leading-7">こちらが行ったこと</h2>
          <p className="mt-4 whitespace-pre-wrap">{work.our_role}</p>
        </div>
        <div className="border border-line p-6">
          <h2 className="text-xl font-medium leading-7">先方が用意したもの</h2>
          <p className="mt-4 whitespace-pre-wrap">{work.client_role}</p>
        </div>
      </section>

      <p>
        <Link href="/works">実績一覧へ戻る</Link>
      </p>
    </article>
  );
}
