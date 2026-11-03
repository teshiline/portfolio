import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getPortfolio } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const portfolio = await getPortfolio();

  return (
    <>
      <SiteHeader />
      <main className="pt-20">{children}</main>
      <SiteFooter settings={portfolio.settings} usingSample={portfolio.source === "sample"} />
    </>
  );
}
