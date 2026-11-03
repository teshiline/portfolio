import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { getPortfolio } from "@/lib/data";
import "./globals.css";

const noto = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPortfolio();
  return {
    title: {
      default: settings.business_name,
      template: `%s | ${settings.business_name}`,
    },
    description: settings.meta_description,
    openGraph: {
      title: settings.business_name,
      description: settings.meta_description,
      locale: "ja_JP",
      type: "website",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={noto.variable}>
      <body className="min-h-screen bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
