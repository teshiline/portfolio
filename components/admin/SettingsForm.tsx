"use client";

import { useActionState, useState } from "react";
import { saveSettings, type ActionResult } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings } from "@/lib/types";

const fieldClass = "min-h-11 w-full border border-line bg-bg px-3";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveSettings, {});
  const [portraitUrl, setPortraitUrl] = useState(settings.portrait_url);
  const [uploadError, setUploadError] = useState("");

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      {[
        ["business_name", "サイト名", settings.business_name],
        ["person_name", "氏名", settings.person_name],
        ["role_label", "肩書き", settings.role_label],
        ["email", "メール", settings.email],
        ["line_url", "LINE URL", settings.line_url],
        ["crowdworks_url", "クラウドワークス URL", settings.crowdworks_url],
      ].map(([name, label, value]) => (
        <label key={name} className="flex flex-col gap-1">
          {label}
          <input name={name} defaultValue={value} className={fieldClass} />
        </label>
      ))}
      <label className="flex flex-col gap-1">
        ヒーロー見出し
        <textarea name="hero_title" defaultValue={settings.hero_title} rows={3} className="w-full border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1">
        ヒーロー本文
        <textarea name="hero_lead" defaultValue={settings.hero_lead} rows={4} className="w-full border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1">
        プロフィール本文
        <textarea name="about_body" defaultValue={settings.about_body} rows={6} className="w-full border border-line px-3 py-2" />
      </label>
      <label className="flex flex-col gap-1">
        説明文（検索結果）
        <textarea name="meta_description" defaultValue={settings.meta_description} rows={3} className="w-full border border-line px-3 py-2" />
      </label>
      <input type="hidden" name="portrait_url" value={portraitUrl} />
      <label className="flex flex-col gap-1">
        顔写真
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const supabase = createClient();
            const ext = (file.name.split(".").pop() ?? "img").toLowerCase().replace(/[^a-z0-9]/g, "") || "img";
            const path = `portrait-${crypto.randomUUID()}.${ext}`;
            const { error } = await supabase.storage.from("media").upload(path, file);
            if (error) {
              setUploadError("写真をアップロードできませんでした。");
              return;
            }
            setPortraitUrl(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
            setUploadError("");
          }}
        />
      </label>
      {portraitUrl ? <img src={portraitUrl} alt="" className="h-40 w-40 bg-surface object-contain" /> : null}
      {uploadError ? <p>{uploadError}</p> : null}
      {state.error ? <p>{state.error}</p> : null}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 w-fit items-center bg-accent px-4 text-white">
        {pending ? "保存中" : "保存する"}
      </button>
    </form>
  );
}
