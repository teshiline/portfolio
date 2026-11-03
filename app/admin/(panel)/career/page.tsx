import { saveCareer } from "@/app/admin/actions";
import { DeleteRecordForm, TextRecordForm } from "@/components/admin/TextRecordForm";
import { getPortfolio } from "@/lib/data";

export const metadata = { title: "経歴管理" };

export default async function AdminCareerPage() {
  const { career } = await getPortfolio(true);

  const fieldsFor = (entry?: (typeof career)[number]) => [
    { name: "period", label: "期間", kind: "text" as const, defaultValue: entry?.period ?? "" },
    { name: "organization", label: "組織", kind: "text" as const, defaultValue: entry?.organization ?? "" },
    { name: "title", label: "役職", kind: "text" as const, defaultValue: entry?.title ?? "" },
    { name: "description", label: "説明", kind: "textarea" as const, defaultValue: entry?.description ?? "" },
    { name: "sort_order", label: "表示順", kind: "number" as const, defaultValue: String(entry?.sort_order ?? 0) },
    { name: "published", label: "公開する", kind: "checkbox" as const, defaultValue: entry?.published ?? true },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-medium leading-10">経歴</h1>
      <TextRecordForm action={saveCareer} submitLabel="追加する" fields={fieldsFor()} />
      {career.map((entry) => (
        <section key={entry.id} className="flex flex-col gap-3">
          <TextRecordForm action={saveCareer} id={entry.id} submitLabel="更新する" fields={fieldsFor(entry)} />
          <DeleteRecordForm table="career_entries" id={entry.id} />
        </section>
      ))}
    </div>
  );
}
