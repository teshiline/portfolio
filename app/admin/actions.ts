"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ASSET_USAGES, type AssetUsage, type EngagementType } from "@/lib/constants";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ActionResult = { error?: string };

function refresh() {
  revalidatePath("/", "layout");
}

function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase の環境変数を設定してからログインできます。" };
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "メールアドレスまたはパスワードが違います。" };

  const { data } = await supabase.auth.getClaims();
  const isAdmin = (data?.claims?.app_metadata as { role?: string } | undefined)?.role === "admin";
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { error: "このアカウントには管理権限がありません。" };
  }
  redirect("/admin");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function saveSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const payload = {
    id: 1,
    business_name: String(formData.get("business_name") ?? "").trim(),
    person_name: String(formData.get("person_name") ?? "").trim(),
    role_label: String(formData.get("role_label") ?? "").trim(),
    hero_title: String(formData.get("hero_title") ?? "").trim(),
    hero_lead: String(formData.get("hero_lead") ?? "").trim(),
    about_body: String(formData.get("about_body") ?? "").trim(),
    portrait_url: String(formData.get("portrait_url") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    line_url: String(formData.get("line_url") ?? "").trim(),
    crowdworks_url: String(formData.get("crowdworks_url") ?? "").trim(),
    meta_description: String(formData.get("meta_description") ?? "").trim(),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) return { error: "サイト設定を保存できませんでした。" };
  refresh();
  return {};
}

async function saveListRecord(
  table: "services" | "career_entries" | "pricing_plans",
  id: string | null,
  values: Record<string, unknown>,
) {
  const supabase = await requireAdmin();
  const query = id
    ? supabase.from(table).update(values).eq("id", id)
    : supabase.from(table).insert(values);
  const { error } = await query;
  if (error) return { error: "保存できませんでした。" } satisfies ActionResult;
  refresh();
  return {} satisfies ActionResult;
}

export async function saveService(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  return saveListRecord("services", id || null, {
    name: String(formData.get("name") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    deliverables: lines(formData.get("deliverables")),
    sort_order: Number(formData.get("sort_order") ?? 0),
    published: formData.get("published") === "on",
  });
}

export async function saveCareer(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  return saveListRecord("career_entries", id || null, {
    period: String(formData.get("period") ?? "").trim(),
    organization: String(formData.get("organization") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0),
    published: formData.get("published") === "on",
  });
}

export async function savePricing(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  return saveListRecord("pricing_plans", id || null, {
    name: String(formData.get("name") ?? "").trim(),
    price_text: String(formData.get("price_text") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    includes: lines(formData.get("includes")),
    recommended: formData.get("recommended") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    published: formData.get("published") === "on",
  });
}

export async function deleteRecord(table: "services" | "career_entries" | "pricing_plans" | "works", id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error("削除できませんでした。");
  refresh();
}

const engagementTypes = new Set<EngagementType>(["new_build", "operation", "improvement"]);
const assetUsages = new Set<AssetUsage>(ASSET_USAGES.map((item) => item.value));

type WorkPayload = {
  id?: string;
  title: string;
  slug: string;
  client_label: string;
  industry: string;
  period: string;
  engagement_type: EngagementType;
  goals: string[];
  friends_before: string;
  friends_after: string;
  summary: string;
  tools: string[];
  scope_items: string[];
  challenge: string;
  approach: string;
  our_role: string;
  client_role: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  results: {
    label: string;
    before_value: string;
    after_value: string;
    display_value: string;
    is_primary: boolean;
  }[];
  assets: {
    image_url: string;
    usage: AssetUsage;
    usage_label: string;
    intent: string;
    is_cover: boolean;
  }[];
};

function asStringList(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : [];
}

export async function saveWork(payload: WorkPayload): Promise<ActionResult> {
  const supabase = await requireAdmin();
  const slug = payload.slug.trim();
  if (!payload.title.trim()) return { error: "タイトルを入力してください。" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "スラッグは英小文字と数字、ハイフンだけにしてください。" };
  }
  if (!engagementTypes.has(payload.engagement_type)) return { error: "依頼種別を選んでください。" };

  const results = payload.results
    .map((result, index) => ({
      label: result.label.trim(),
      before_value: result.before_value.trim(),
      after_value: result.after_value.trim(),
      display_value: result.display_value.trim(),
      is_primary: Boolean(result.is_primary),
      sort_order: index + 1,
    }))
    .filter((result) => result.label);
  const primaryCount = results.filter((result) => result.is_primary).length;
  if (results.length > 0 && primaryCount !== 1) {
    return { error: "成果の主指標は1件だけ選んでください。" };
  }

  const assets = payload.assets.map((asset, index) => ({
    image_url: asset.image_url.trim(),
    usage: asset.usage,
    usage_label: asset.usage_label.trim(),
    intent: asset.intent.trim(),
    is_cover: Boolean(asset.is_cover),
    sort_order: index + 1,
  }));
  for (const asset of assets) {
    if (!asset.image_url) return { error: "制作画像をアップロードしてください。" };
    if (!assetUsages.has(asset.usage)) return { error: "制作画像の用途を選んでください。" };
    if (asset.usage === "other" && !asset.usage_label) return { error: "その他の用途名を入力してください。" };
    if (!asset.intent) return { error: "制作画像の意図を入力してください。" };
  }
  if (assets.filter((asset) => asset.is_cover).length > 1) {
    return { error: "カバー画像は1枚だけ選んでください。" };
  }

  const workValues = {
    title: payload.title.trim(),
    slug,
    client_label: payload.client_label.trim(),
    industry: payload.industry.trim(),
    period: payload.period.trim(),
    engagement_type: payload.engagement_type,
    goals: asStringList(payload.goals),
    friends_before: payload.friends_before.trim(),
    friends_after: payload.friends_after.trim(),
    summary: payload.summary.trim(),
    tools: asStringList(payload.tools),
    scope_items: asStringList(payload.scope_items),
    challenge: payload.challenge.trim(),
    approach: payload.approach.trim(),
    our_role: payload.our_role.trim(),
    client_role: payload.client_role.trim(),
    featured: Boolean(payload.featured),
    published: Boolean(payload.published),
    sort_order: Number(payload.sort_order) || 0,
    updated_at: new Date().toISOString(),
  };

  let workId = payload.id;
  if (workId) {
    const { error } = await supabase.from("works").update(workValues).eq("id", workId);
    if (error) {
      const duplicate = error.message.includes("duplicate");
      return { error: duplicate ? "同じスラッグの実績があります。" : "実績を保存できませんでした。" };
    }
    const { error: deleteResultsError } = await supabase.from("work_results").delete().eq("work_id", workId);
    const { error: deleteAssetsError } = await supabase.from("work_assets").delete().eq("work_id", workId);
    if (deleteResultsError || deleteAssetsError) return { error: "実績の内訳を更新できませんでした。" };
  } else {
    const { data, error } = await supabase.from("works").insert(workValues).select("id").single();
    if (error || !data) {
      const duplicate = error?.message?.includes("duplicate");
      return { error: duplicate ? "同じスラッグの実績があります。" : "実績を保存できませんでした。" };
    }
    workId = data.id;
  }

  if (results.length > 0) {
    const { error } = await supabase.from("work_results").insert(results.map((result) => ({ ...result, work_id: workId })));
    if (error) return { error: "成果を保存できませんでした。" };
  }
  if (assets.length > 0) {
    const { error } = await supabase.from("work_assets").insert(assets.map((asset) => ({ ...asset, work_id: workId })));
    if (error) return { error: "制作画像を保存できませんでした。" };
  }

  refresh();
  redirect("/admin/works");
}

export async function removeRecord(formData: FormData) {
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  if (table !== "services" && table !== "career_entries" && table !== "pricing_plans" && table !== "works") {
    return;
  }
  await deleteRecord(table, id);
}

export async function deleteWork(id: string) {
  await deleteRecord("works", id);
  redirect("/admin/works");
}
