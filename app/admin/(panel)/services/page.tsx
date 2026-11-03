import { saveService } from "@/app/admin/actions";
import { DeleteRecordForm, TextRecordForm } from "@/components/admin/TextRecordForm";
import { getPortfolio } from "@/lib/data";

export const metadata = { title: "サービス管理" };

export default async function AdminServicesPage() {
  const { services } = await getPortfolio(true);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-medium leading-10">サービス</h1>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-medium leading-8">追加</h2>
        <TextRecordForm
          action={saveService}
          submitLabel="追加する"
          fields={[
            { name: "name", label: "名前", kind: "text" },
            { name: "summary", label: "概要", kind: "textarea" },
            { name: "body", label: "本文", kind: "textarea" },
            { name: "deliverables", label: "できること", kind: "textarea", hint: "1行に1項目" },
            { name: "sort_order", label: "表示順", kind: "number", defaultValue: "0" },
            { name: "published", label: "公開する", kind: "checkbox", defaultValue: true },
          ]}
        />
      </section>
      {services.map((service) => (
        <section key={service.id} className="flex flex-col gap-3">
          <TextRecordForm
            action={saveService}
            id={service.id}
            submitLabel="更新する"
            fields={[
              { name: "name", label: "名前", kind: "text", defaultValue: service.name },
              { name: "summary", label: "概要", kind: "textarea", defaultValue: service.summary },
              { name: "body", label: "本文", kind: "textarea", defaultValue: service.body },
              { name: "deliverables", label: "できること", kind: "textarea", defaultValue: service.deliverables.join("\n"), hint: "1行に1項目" },
              { name: "sort_order", label: "表示順", kind: "number", defaultValue: String(service.sort_order) },
              { name: "published", label: "公開する", kind: "checkbox", defaultValue: service.published },
            ]}
          />
          <DeleteRecordForm table="services" id={service.id} />
        </section>
      ))}
    </div>
  );
}
