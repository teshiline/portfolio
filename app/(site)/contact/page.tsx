import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { getPortfolio } from "@/lib/data";

export const metadata: Metadata = { title: "お問い合わせ" };

export default async function ContactPage() {
  const { settings } = await getPortfolio();

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 py-16 md:px-6 md:py-24">
      <header className="max-w-3xl">
        <h1 className="text-[32px] font-medium leading-10">お問い合わせ</h1>
        <p className="mt-4">業種、いまの友だち数、頼みたい作業が分かると返信が早くなります。</p>
        {settings.email ? (
          <p className="mt-4">
            メールでの連絡: <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
        ) : null}
      </header>
      <ContactForm />
    </div>
  );
}
