import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({
  settings,
  usingSample,
}: {
  settings: SiteSettings;
  usingSample: boolean;
}) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-4 py-8 md:px-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {settings.email ? (
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          ) : null}
          {settings.line_url ? (
            <a href={settings.line_url}>LINE</a>
          ) : null}
          {settings.crowdworks_url ? (
            <a href={settings.crowdworks_url}>クラウドワークス</a>
          ) : null}
          <Link href="/contact">問い合わせ</Link>
        </div>
        <p className="text-[13px] leading-5 text-muted">
          {usingSample
            ? `${settings.business_name}。いま表示している文章と数値はサンプルです。`
            : settings.business_name}
        </p>
      </div>
    </footer>
  );
}
