import type { Metadata } from "next";
import { getPortfolio } from "@/lib/data";

export const metadata: Metadata = { title: "料金" };

export default async function PricingPage() {
  const { pricing } = await getPortfolio();

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
      <header className="max-w-3xl">
        <h1 className="text-[32px] font-medium leading-10">料金</h1>
        <p className="mt-4">範囲と期間で変わります。掲載価格は起点です。</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {pricing.map((plan) => (
          <article
            key={plan.id}
            className={`border border-line p-6 ${plan.recommended ? "bg-surface" : "bg-bg"}`}
          >
            <p className="text-[13px] leading-5 text-muted">{plan.unit}</p>
            <h2 className="mt-2 text-2xl font-medium leading-8">{plan.name}</h2>
            <p className="mt-4 text-[32px] font-medium leading-10">{plan.price_text}</p>
            <p className="mt-4">{plan.description}</p>
            <ul className="mt-6 flex flex-col gap-2">
              {plan.includes.map((item) => (
                <li key={item} className="border-t border-line pt-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
