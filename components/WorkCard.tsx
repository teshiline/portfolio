import Link from "next/link";
import { engagementLabel } from "@/lib/constants";
import type { Work } from "@/lib/types";
import { coverAsset, metricText, primaryResult } from "@/lib/work-display";

export function WorkCard({ work }: { work: Work }) {
  const cover = coverAsset(work);
  const metric = metricText(primaryResult(work));

  return (
    <article className="flex flex-col border border-line bg-bg">
      <Link href={`/works/${work.slug}`} className="bg-surface text-ink no-underline">
        {cover ? (
          <img
            src={cover.image_url}
            alt=""
            className="aspect-[2500/1686] w-full object-contain"
          />
        ) : (
          <div className="aspect-[2500/1686] w-full" />
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <p className="text-[13px] leading-5 text-muted">
          {work.industry} / {engagementLabel(work.engagement_type)}
        </p>
        <h2 className="text-xl font-medium leading-7">
          <Link href={`/works/${work.slug}`} className="text-ink no-underline">
            {work.title}
          </Link>
        </h2>
        {work.tools.length > 0 ? (
          <p className="text-[13px] leading-5 text-muted">{work.tools.join("、")}</p>
        ) : null}
        {metric ? <p className="mt-auto pt-2 font-medium">{metric}</p> : null}
      </div>
    </article>
  );
}
