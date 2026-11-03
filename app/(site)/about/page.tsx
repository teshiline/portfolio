import type { Metadata } from "next";
import { getPortfolio } from "@/lib/data";

export const metadata: Metadata = { title: "プロフィール" };

export default async function AboutPage() {
  const { settings, career } = await getPortfolio();

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16 px-4 py-16 md:px-6 md:py-24">
      <div className="grid items-start gap-8 md:grid-cols-[240px_1fr]">
        {settings.portrait_url ? (
          <img
            src={settings.portrait_url}
            alt=""
            className="aspect-square w-full max-w-60 bg-surface object-contain"
          />
        ) : null}
        <header>
          <p className="text-muted">{settings.role_label}</p>
          <h1 className="mt-2 text-[32px] font-medium leading-10">{settings.person_name}</h1>
          <p className="mt-4 max-w-3xl whitespace-pre-wrap">{settings.about_body}</p>
        </header>
      </div>
      <section>
        <h2 className="text-2xl font-medium leading-8">経歴</h2>
        <ol className="mt-6 flex flex-col">
          {career.map((entry) => (
            <li key={entry.id} className="grid gap-2 border-t border-line py-6 md:grid-cols-[180px_1fr]">
              <p className="text-muted">{entry.period}</p>
              <div>
                <p className="font-medium">
                  {entry.organization} / {entry.title}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{entry.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
