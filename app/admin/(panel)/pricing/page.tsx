import { savePricing } from "@/app/admin/actions";
import { DeleteRecordForm, TextRecordForm } from "@/components/admin/TextRecordForm";
import { getPortfolio } from "@/lib/data";

export const metadata = { title: "料金管理" };

export default async function AdminPricingPage() {
  const { pricing } = await getPortfolio(true);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-medium leading-10">料金</h1>
      <TextRecordForm
        action={savePricing}
        submitLabel="追加する"
        fields={[
          { name: "name", label: "プラン名", kind: "text" },
          { name: "price_text", label: "価格表記", kind: "text" },
          { name: "unit", label: "単位", kind: "text" },
          { name: "description", label: "説明", kind: "textarea" },
          { name: "includes", label: "含まれる作業", kind: "textarea", hint: "1行に1項目" },
          { name: "sort_order", label: "表示順", kind: "number", defaultValue: "0" },
          { name: "recommended", label: "推奨", kind: "checkbox" },
          { name: "published", label: "公開する", kind: "checkbox", defaultValue: true },
        ]}
      />
      {pricing.map((plan) => (
        <section key={plan.id} className="flex flex-col gap-3">
          <TextRecordForm
            action={savePricing}
            id={plan.id}
            submitLabel="更新する"
            fields={[
              { name: "name", label: "プラン名", kind: "text", defaultValue: plan.name },
              { name: "price_text", label: "価格表記", kind: "text", defaultValue: plan.price_text },
              { name: "unit", label: "単位", kind: "text", defaultValue: plan.unit },
              { name: "description", label: "説明", kind: "textarea", defaultValue: plan.description },
              { name: "includes", label: "含まれる作業", kind: "textarea", defaultValue: plan.includes.join("\n"), hint: "1行に1項目" },
              { name: "sort_order", label: "表示順", kind: "number", defaultValue: String(plan.sort_order) },
              { name: "recommended", label: "推奨", kind: "checkbox", defaultValue: plan.recommended },
              { name: "published", label: "公開する", kind: "checkbox", defaultValue: plan.published },
            ]}
          />
          <DeleteRecordForm table="pricing_plans" id={plan.id} />
        </section>
      ))}
    </div>
  );
}
