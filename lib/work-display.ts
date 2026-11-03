import { usageLabel } from "@/lib/constants";
import type { Work, WorkAsset, WorkResult } from "@/lib/types";

export function primaryResult(work: Work): WorkResult | undefined {
  return work.results.find((result) => result.is_primary) ?? work.results[0];
}

export function metricText(result?: WorkResult) {
  if (!result) return "";
  if (result.display_value.trim()) return result.display_value.trim();
  if (result.before_value.trim() && result.after_value.trim()) {
    return `${result.label} ${result.before_value} → ${result.after_value}`;
  }
  return result.after_value || result.before_value || result.label;
}

export function coverAsset(work: Work): WorkAsset | undefined {
  return work.assets.find((asset) => asset.is_cover) ?? work.assets[0];
}

export function assetGroups(work: Work) {
  const groups: { label: string; assets: WorkAsset[] }[] = [];
  const sorted = [...work.assets].sort((a, b) => a.sort_order - b.sort_order);
  for (const asset of sorted) {
    const label = usageLabel(asset.usage, asset.usage_label);
    const current = groups.find((group) => group.label === label);
    if (current) current.assets.push(asset);
    else groups.push({ label, assets: [asset] });
  }
  return groups;
}

export function sortByOrder<T extends { sort_order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sort_order - b.sort_order);
}
