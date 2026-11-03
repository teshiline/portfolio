"use client";

import { useState } from "react";
import { ASSET_USAGES, ENGAGEMENT_TYPES, SCOPE_PRESETS, TOOL_PRESETS, type AssetUsage, type EngagementType } from "@/lib/constants";
import { deleteWork, saveWork } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Work } from "@/lib/types";

type ResultDraft = {
  label: string;
  before_value: string;
  after_value: string;
  display_value: string;
  is_primary: boolean;
};

type AssetDraft = {
  image_url: string;
  usage: AssetUsage;
  usage_label: string;
  intent: string;
  is_cover: boolean;
};

const fieldClass = "min-h-11 w-full border border-line bg-bg px-3";

function ChipEditor({
  label,
  values,
  presets,
  onChange,
}: {
  label: string;
  values: string[];
  presets: readonly string[];
  onChange: (values: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = (value: string) => {
    const next = value.trim();
    if (!next || values.includes(next)) return;
    onChange([...values, next]);
  };

  return (
    <fieldset className="flex flex-col gap-3">
      <legend>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <label key={preset} className="inline-flex min-h-11 items-center gap-2 border border-line px-3">
            <input
              type="checkbox"
              checked={values.includes(preset)}
              onChange={(event) => {
                onChange(
                  event.target.checked ? [...values, preset] : values.filter((item) => item !== preset),
                );
              }}
            />
            {preset}
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} className={fieldClass} placeholder="候補にない項目" />
        <button
          type="button"
          className="inline-flex min-h-11 items-center border border-line px-4"
          onClick={() => {
            add(draft);
            setDraft("");
          }}
        >
          追加
        </button>
      </div>
      {values.filter((value) => !presets.includes(value)).length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {values
            .filter((value) => !presets.includes(value))
            .map((value) => (
              <li key={value}>
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center border border-line px-3"
                  onClick={() => onChange(values.filter((item) => item !== value))}
                >
                  {value} を外す
                </button>
              </li>
            ))}
        </ul>
      ) : null}
    </fieldset>
  );
}

async function uploadMedia(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("画像ファイルを選んでください。");
  if (file.size > 5 * 1024 * 1024) throw new Error("画像は5MB以下にしてください。");
  const supabase = createClient();
  const ext = (file.name.split(".").pop() ?? "img").toLowerCase().replace(/[^a-z0-9]/g, "") || "img";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw new Error("画像をアップロードできませんでした。ログインとStorageの設定を確認してください。");
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export function WorkEditor({ work }: { work?: Work }) {
  const [title, setTitle] = useState(work?.title ?? "");
  const [slug, setSlug] = useState(work?.slug ?? "");
  const [clientLabel, setClientLabel] = useState(work?.client_label ?? "");
  const [industry, setIndustry] = useState(work?.industry ?? "");
  const [period, setPeriod] = useState(work?.period ?? "");
  const [engagement, setEngagement] = useState<EngagementType>(work?.engagement_type ?? "new_build");
  const [goals, setGoals] = useState<string[]>(work?.goals ?? []);
  const [friendsBefore, setFriendsBefore] = useState(work?.friends_before ?? "");
  const [friendsAfter, setFriendsAfter] = useState(work?.friends_after ?? "");
  const [summary, setSummary] = useState(work?.summary ?? "");
  const [tools, setTools] = useState<string[]>(work?.tools ?? []);
  const [scopeItems, setScopeItems] = useState<string[]>(work?.scope_items ?? []);
  const [challenge, setChallenge] = useState(work?.challenge ?? "");
  const [approach, setApproach] = useState(work?.approach ?? "");
  const [ourRole, setOurRole] = useState(work?.our_role ?? "");
  const [clientRole, setClientRole] = useState(work?.client_role ?? "");
  const [featured, setFeatured] = useState(work?.featured ?? false);
  const [published, setPublished] = useState(work?.published ?? false);
  const [sortOrder, setSortOrder] = useState(String(work?.sort_order ?? 0));
  const [results, setResults] = useState<ResultDraft[]>(
    work?.results.map((result) => ({
      label: result.label,
      before_value: result.before_value,
      after_value: result.after_value,
      display_value: result.display_value,
      is_primary: result.is_primary,
    })) ?? [{ label: "", before_value: "", after_value: "", display_value: "", is_primary: true }],
  );
  const [assets, setAssets] = useState<AssetDraft[]>(
    work?.assets.map((asset) => ({
      image_url: asset.image_url,
      usage: asset.usage,
      usage_label: asset.usage_label,
      intent: asset.intent,
      is_cover: asset.is_cover,
    })) ?? [],
  );
  const [goalDraft, setGoalDraft] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const result = await saveWork({
      id: work?.id,
      title,
      slug,
      client_label: clientLabel,
      industry,
      period,
      engagement_type: engagement,
      goals,
      friends_before: friendsBefore,
      friends_after: friendsAfter,
      summary,
      tools,
      scope_items: scopeItems,
      challenge,
      approach,
      our_role: ourRole,
      client_role: clientRole,
      featured,
      published,
      sort_order: Number(sortOrder) || 0,
      results,
      assets,
    });
    if (result?.error) {
      setError(result.error);
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">基本</h2>
        <label className="flex flex-col gap-1">タイトル<input required value={title} onChange={(event) => setTitle(event.target.value)} className={fieldClass} /></label>
        <label className="flex flex-col gap-1">スラッグ<input required value={slug} onChange={(event) => setSlug(event.target.value)} className={fieldClass} placeholder="beauty-salon-reservation" /></label>
        <label className="flex flex-col gap-1">クライアント表記<input value={clientLabel} onChange={(event) => setClientLabel(event.target.value)} className={fieldClass} /></label>
        <label className="flex flex-col gap-1">業種<input value={industry} onChange={(event) => setIndustry(event.target.value)} className={fieldClass} /></label>
        <label className="flex flex-col gap-1">期間<input value={period} onChange={(event) => setPeriod(event.target.value)} className={fieldClass} /></label>
        <label className="flex flex-col gap-1">
          依頼種別
          <select value={engagement} onChange={(event) => setEngagement(event.target.value as EngagementType)} className={fieldClass}>
            {ENGAGEMENT_TYPES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>
        <fieldset className="flex flex-col gap-3">
          <legend>目的</legend>
          <div className="flex gap-2">
            <input value={goalDraft} onChange={(event) => setGoalDraft(event.target.value)} className={fieldClass} placeholder="予約" />
            <button type="button" className="inline-flex min-h-11 items-center border border-line px-4" onClick={() => { const next = goalDraft.trim(); if (next && !goals.includes(next)) setGoals([...goals, next]); setGoalDraft(""); }}>追加</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => (
              <button key={goal} type="button" className="inline-flex min-h-11 items-center border border-line px-3" onClick={() => setGoals(goals.filter((item) => item !== goal))}>{goal} を外す</button>
            ))}
          </div>
        </fieldset>
        <label className="flex flex-col gap-1">友だち規模（開始）<input value={friendsBefore} onChange={(event) => setFriendsBefore(event.target.value)} className={fieldClass} /></label>
        <label className="flex flex-col gap-1">友だち規模（終了）<input value={friendsAfter} onChange={(event) => setFriendsAfter(event.target.value)} className={fieldClass} /></label>
        <label className="flex flex-col gap-1">概要<textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={4} className="w-full border border-line px-3 py-2" /></label>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-medium leading-8">ツール</h2>
        <ChipEditor label="利用ツール" values={tools} presets={TOOL_PRESETS} onChange={setTools} />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-medium leading-8">制作範囲</h2>
        <ChipEditor label="納品した作業" values={scopeItems} presets={SCOPE_PRESETS} onChange={setScopeItems} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">文章</h2>
        <label className="flex flex-col gap-1">課題<textarea value={challenge} onChange={(event) => setChallenge(event.target.value)} rows={5} className="w-full border border-line px-3 py-2" /></label>
        <label className="flex flex-col gap-1">施策<textarea value={approach} onChange={(event) => setApproach(event.target.value)} rows={5} className="w-full border border-line px-3 py-2" /></label>
        <label className="flex flex-col gap-1">こちらが行ったこと<textarea value={ourRole} onChange={(event) => setOurRole(event.target.value)} rows={4} className="w-full border border-line px-3 py-2" /></label>
        <label className="flex flex-col gap-1">先方が用意したもの<textarea value={clientRole} onChange={(event) => setClientRole(event.target.value)} rows={4} className="w-full border border-line px-3 py-2" /></label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">成果</h2>
        {results.map((result, index) => (
          <div key={index} className="grid gap-3 border border-line p-4">
            <label className="flex flex-col gap-1">指標名<input value={result.label} onChange={(event) => setResults(results.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} className={fieldClass} /></label>
            <label className="flex flex-col gap-1">前<input value={result.before_value} onChange={(event) => setResults(results.map((item, itemIndex) => itemIndex === index ? { ...item, before_value: event.target.value } : item))} className={fieldClass} /></label>
            <label className="flex flex-col gap-1">後<input value={result.after_value} onChange={(event) => setResults(results.map((item, itemIndex) => itemIndex === index ? { ...item, after_value: event.target.value } : item))} className={fieldClass} /></label>
            <label className="flex flex-col gap-1">表示用の要約<input value={result.display_value} onChange={(event) => setResults(results.map((item, itemIndex) => itemIndex === index ? { ...item, display_value: event.target.value } : item))} className={fieldClass} /></label>
            <label className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="primary-result" checked={result.is_primary} onChange={() => setResults(results.map((item, itemIndex) => ({ ...item, is_primary: itemIndex === index })))} />
              主指標
            </label>
            <button type="button" className="inline-flex min-h-11 w-fit items-center border border-line px-4" onClick={() => setResults(results.filter((_, itemIndex) => itemIndex !== index))}>この成果を外す</button>
          </div>
        ))}
        <button type="button" className="inline-flex min-h-11 w-fit items-center border border-line px-4" onClick={() => setResults([...results, { label: "", before_value: "", after_value: "", display_value: "", is_primary: results.length === 0 }])}>成果を追加</button>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-medium leading-8">制作画像</h2>
        <p className="text-muted">用途と意図は必須です。リッチメニューは詳細ページで横長の全体を表示します。</p>
        {assets.map((asset, index) => (
          <div key={index} className="grid gap-3 border border-line p-4">
            {asset.image_url ? <img src={asset.image_url} alt="" className="max-h-48 w-full bg-surface object-contain" /> : null}
            <label className="flex flex-col gap-1">
              画像
              <input
                type="file"
                accept="image/*"
                className="min-h-11"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadMedia(file);
                    setAssets(assets.map((item, itemIndex) => itemIndex === index ? { ...item, image_url: url } : item));
                    setError("");
                  } catch (uploadError) {
                    setError(uploadError instanceof Error ? uploadError.message : "画像をアップロードできませんでした。");
                  }
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              用途
              <select value={asset.usage} onChange={(event) => setAssets(assets.map((item, itemIndex) => itemIndex === index ? { ...item, usage: event.target.value as AssetUsage } : item))} className={fieldClass}>
                {ASSET_USAGES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            {asset.usage === "other" ? (
              <label className="flex flex-col gap-1">用途名<input value={asset.usage_label} onChange={(event) => setAssets(assets.map((item, itemIndex) => itemIndex === index ? { ...item, usage_label: event.target.value } : item))} className={fieldClass} /></label>
            ) : null}
            <label className="flex flex-col gap-1">意図<textarea required value={asset.intent} onChange={(event) => setAssets(assets.map((item, itemIndex) => itemIndex === index ? { ...item, intent: event.target.value } : item))} rows={3} className="w-full border border-line px-3 py-2" /></label>
            <label className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="cover-asset" checked={asset.is_cover} onChange={() => setAssets(assets.map((item, itemIndex) => ({ ...item, is_cover: itemIndex === index })))} />
              一覧のカバーにする
            </label>
            <button type="button" className="inline-flex min-h-11 w-fit items-center border border-line px-4" onClick={() => setAssets(assets.filter((_, itemIndex) => itemIndex !== index))}>この画像を外す</button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex min-h-11 w-fit items-center border border-line px-4"
          onClick={() => setAssets([...assets, { image_url: "", usage: "rich_menu", usage_label: "", intent: "", is_cover: assets.length === 0 }])}
        >
          画像を追加
        </button>
      </section>

      <section className="flex flex-col gap-4 border-t border-line pt-6">
        <h2 className="text-2xl font-medium leading-8">公開</h2>
        <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />注目実績</label>
        <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />公開する</label>
        <label className="flex max-w-40 flex-col gap-1">表示順<input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className={fieldClass} /></label>
      </section>

      {error ? <p>{error}</p> : null}
      {!isSupabaseConfigured() ? <p>Supabase 未接続のため、この画面からの保存はできません。</p> : null}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center bg-accent px-4 text-white">{pending ? "保存中" : "保存する"}</button>
        {work ? (
          <button
            type="button"
            className="inline-flex min-h-11 items-center border border-line px-4"
            onClick={() => {
              if (window.confirm("この実績を削除しますか？")) void deleteWork(work.id);
            }}
          >
            削除
          </button>
        ) : null}
      </div>
    </form>
  );
}
