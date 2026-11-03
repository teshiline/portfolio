"use client";

import { useActionState } from "react";
import { removeRecord, type ActionResult } from "@/app/admin/actions";

const inputClass = "min-h-11 w-full border border-line bg-bg px-3 text-base";

export function TextRecordForm({
  action,
  id,
  fields,
  submitLabel,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  id?: string;
  fields: {
    name: string;
    label: string;
    kind: "text" | "textarea" | "number" | "checkbox";
    defaultValue?: string | boolean;
    hint?: string;
  }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-line p-6">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-1">
          <span>{field.label}</span>
          {field.kind === "textarea" ? (
            <textarea
              name={field.name}
              rows={5}
              defaultValue={typeof field.defaultValue === "string" ? field.defaultValue : ""}
              className="w-full border border-line px-3 py-2"
            />
          ) : field.kind === "checkbox" ? (
            <input
              type="checkbox"
              name={field.name}
              defaultChecked={field.defaultValue === true}
              className="size-5"
            />
          ) : (
            <input
              name={field.name}
              type={field.kind === "number" ? "number" : "text"}
              defaultValue={typeof field.defaultValue === "string" ? field.defaultValue : ""}
              className={inputClass}
            />
          )}
          {field.hint ? <span className="text-[13px] leading-5 text-muted">{field.hint}</span> : null}
        </label>
      ))}
      {state.error ? <p>{state.error}</p> : null}
      <button type="submit" disabled={pending} className="inline-flex min-h-11 w-fit items-center bg-accent px-4 text-white">
        {pending ? "保存中" : submitLabel}
      </button>
    </form>
  );
}

export function DeleteRecordForm({ table, id }: { table: string; id: string }) {
  return (
    <form
      action={removeRecord}
      onSubmit={(event) => {
        if (!window.confirm("削除しますか？")) event.preventDefault();
      }}
    >
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex min-h-11 items-center border border-line px-4">
        削除
      </button>
    </form>
  );
}
