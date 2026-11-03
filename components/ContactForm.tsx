"use client";

import { useActionState } from "react";
import { submitInquiry, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitInquiry, initial);

  return (
    <form action={action} className="flex max-w-3xl flex-col gap-4">
      <label className="flex flex-col gap-1">
        名前
        <input name="name" required maxLength={80} className="min-h-11 border border-line px-3" />
      </label>
      <label className="flex flex-col gap-1">
        メール
        <input name="email" type="email" required maxLength={200} className="min-h-11 border border-line px-3" />
      </label>
      <label className="flex flex-col gap-1">
        依頼概要
        <textarea name="message" required rows={8} maxLength={4000} className="border border-line px-3 py-2" />
      </label>
      <label className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        会社サイト
        <input name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-fit items-center bg-accent px-4 text-white disabled:opacity-60"
      >
        {pending ? "送信中" : "送信する"}
      </button>
      {state.message ? (
        <p role="status" className={state.status === "error" ? "text-ink" : "text-ink"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
