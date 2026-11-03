"use client";

import { useActionState } from "react";
import { signIn, type ActionResult } from "@/app/admin/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(signIn, {});

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16 md:px-6">
      <h1 className="text-[32px] font-medium leading-10">ログイン</h1>
      <form action={action} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          メール
          <input name="email" type="email" required className="min-h-11 border border-line px-3" />
        </label>
        <label className="flex flex-col gap-1">
          パスワード
          <input name="password" type="password" required className="min-h-11 border border-line px-3" />
        </label>
        {state.error ? <p>{state.error}</p> : null}
        <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center bg-accent px-4 text-white">
          {pending ? "確認中" : "ログイン"}
        </button>
      </form>
    </div>
  );
}
