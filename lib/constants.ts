export const TOOL_PRESETS = [
  "LINE公式アカウント",
  "Lステップ",
  "エルメ",
  "Google Analytics 4",
  "Looker Studio",
  "LINE広告",
] as const;

export const SCOPE_PRESETS = [
  "リッチメニュー",
  "あいさつメッセージ",
  "ステップ配信",
  "セグメント配信",
  "応答メッセージ",
  "ショップカード",
  "フォーム / LIFF",
  "タグ設計",
  "数値レポート",
] as const;

export const ASSET_USAGES = [
  { value: "rich_menu", label: "リッチメニュー" },
  { value: "greeting", label: "あいさつメッセージ" },
  { value: "message_image", label: "メッセージ画像" },
  { value: "rich_message", label: "リッチメッセージ" },
  { value: "flex", label: "フレックスメッセージ" },
  { value: "shop_card", label: "ショップカード" },
  { value: "other", label: "その他" },
] as const;

export const ENGAGEMENT_TYPES = [
  { value: "new_build", label: "新規構築" },
  { value: "operation", label: "運用代行" },
  { value: "improvement", label: "改善・リニューアル" },
] as const;

export type AssetUsage = (typeof ASSET_USAGES)[number]["value"];
export type EngagementType = (typeof ENGAGEMENT_TYPES)[number]["value"];

export function engagementLabel(value: string) {
  return ENGAGEMENT_TYPES.find((item) => item.value === value)?.label ?? value;
}

export function usageLabel(usage: string, customLabel: string) {
  if (usage === "other") return customLabel.trim();
  return ASSET_USAGES.find((item) => item.value === usage)?.label ?? usage;
}

export const NAV_ITEMS = [
  { href: "/services", label: "SERVICES" },
  { href: "/works", label: "WORKS" },
  { href: "/about", label: "ABOUT" },
  { href: "/contact", label: "CONTACT" },
] as const;
