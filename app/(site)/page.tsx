import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { WorkCard } from "@/components/WorkCard";
import { getPortfolio } from "@/lib/data";

export default async function HomePage() {
  const { settings, services, works, career, pricing } = await getPortfolio();
  const featured = works.filter((work) => work.featured).slice(0, 3);
  const shownWorks = featured.length > 0 ? featured : works.slice(0, 3);

  return (
    <>
      <HeroSection crowdworksUrl={settings.crowdworks_url} />

      <section className="mx-auto w-full max-w-[1120px] px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-2xl font-medium leading-8">サービス</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {services.slice(0, 3).map((service) => (
            <article key={service.id} className="border border-line p-6">
              <h3 className="text-xl font-medium leading-7">{service.name}</h3>
              <p className="mt-4">{service.summary}</p>
            </article>
          ))}
        </div>
        <p className="mt-6">
          <Link href="/services">サービス一覧</Link>
        </p>
      </section>

      <section className="bg-surface">
        <div className="mx-auto w-full max-w-[1120px] px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-2xl font-medium leading-8">実績</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {shownWorks.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-2xl font-medium leading-8">料金</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {pricing.slice(0, 3).map((plan) => (
            <article key={plan.id} className="border border-line p-6">
              <h3 className="text-xl font-medium leading-7">{plan.name}</h3>
              <p className="mt-2 text-2xl font-medium leading-8">{plan.price_text}</p>
            </article>
          ))}
        </div>
        <p className="mt-6">
          <Link href="/pricing">料金の詳細</Link>
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-4 py-16 md:px-6 md:py-24">
        <h2 className="text-2xl font-medium leading-8">経歴</h2>
        <ol className="mt-6 flex flex-col">
          {career.slice(0, 3).map((entry) => (
            <li key={entry.id} className="border-t border-line py-4">
              <p className="text-[13px] leading-5 text-muted">{entry.period}</p>
              <p className="font-medium">
                {entry.organization} / {entry.title}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          <Link href="/about">プロフィール</Link>
        </p>
      </section>
    </>
  );
}
