import type { Metadata } from "next";
import { getPortfolio } from "@/lib/data";

export const metadata: Metadata = { title: "サービス" };

export default async function ServicesPage() {
  const { services } = await getPortfolio();

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-12 px-4 py-16 md:px-6 md:py-24">
      <header className="max-w-3xl">
        <h1 className="text-[32px] font-medium leading-10">サービス</h1>
        <p className="mt-4">構築、運用、計測のどこから頼むかを、作業範囲ごと確認できます。</p>
      </header>
      <div className="flex flex-col gap-8">
        {services.map((service) => (
          <article key={service.id} className="border border-line p-6">
            <h2 className="text-2xl font-medium leading-8">{service.name}</h2>
            <p className="mt-4">{service.summary}</p>
            <p className="mt-4 max-w-3xl whitespace-pre-wrap">{service.body}</p>
            {service.deliverables.length > 0 ? (
              <ul className="mt-6 grid gap-2 md:grid-cols-2">
                {service.deliverables.map((item) => (
                  <li key={item} className="bg-surface px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
