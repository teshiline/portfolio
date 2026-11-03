"use client";

import { useEffect, useId, useState } from "react";
import type { WorkAsset } from "@/lib/types";

type Group = { label: string; assets: WorkAsset[] };

export function WorkGallery({ groups }: { groups: Group[] }) {
  const titleId = useId();
  const [active, setActive] = useState<WorkAsset | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <section key={group.label} className="flex flex-col gap-6">
          <h3 className="text-xl font-medium leading-7">{group.label}</h3>
          <div className="flex flex-col gap-8">
            {group.assets.map((asset) => {
              const wide = asset.usage === "rich_menu";
              return (
                <figure key={asset.id} className={wide ? "w-full" : "w-full max-w-3xl"}>
                  <button
                    type="button"
                    className="block w-full border-0 bg-surface p-0"
                    aria-label={`${group.label}を拡大`}
                    onClick={() => setActive(asset)}
                  >
                    <img src={asset.image_url} alt={group.label} className="h-auto w-full object-contain" />
                  </button>
                  <figcaption className="pt-3">
                    <p className="font-medium">{group.label}</p>
                    <p>{asset.intent}</p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
      {active ? (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-bg p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="flex max-h-full w-full max-w-[1120px] flex-col gap-4 overflow-auto">
            <div className="flex items-center justify-between gap-4">
              <p id={titleId} className="font-medium">
                {groups.find((group) => group.assets.some((asset) => asset.id === active.id))?.label}
              </p>
              <button
                type="button"
                className="inline-flex min-h-11 items-center border border-line px-4"
                onClick={() => setActive(null)}
              >
                閉じる
              </button>
            </div>
            <img src={active.image_url} alt="" className="h-auto w-full bg-surface object-contain" />
            <p>{active.intent}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
