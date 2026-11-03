import Link from "next/link";
import { HeroVisual } from "@/components/HeroVisual";

export function HeroSection({ crowdworksUrl }: { crowdworksUrl: string }) {
  const consultUrl = crowdworksUrl.trim() || "https://crowdworks.jp/";

  return (
    <section className="bg-[#F2FAF3]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 px-5 pt-5 pb-16 md:flex-row md:items-center md:px-10 md:pt-5 md:pb-20">
        <div className="hero-fade flex w-full flex-col gap-6 md:w-1/2">
          <h1 className="text-[36px] leading-[1.5] font-bold text-[#2C3E50] md:text-[48px]">
            LINE運用・構築で、
            <br />
            あなたのビジネスを加速させる。
          </h1>
          <p className="text-[16px] leading-[1.6] font-normal text-[#2C3E50] md:text-[20px]">
            個人事業主ならではの、伴走型サポート。
            <br />
            成果が出るLINE活用をご提案します。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/works"
              className="inline-flex min-h-11 items-center justify-center border border-[#06C755] bg-white px-6 text-base font-bold text-[#06C755] no-underline transition duration-300 hover:bg-[#06C755] hover:text-white"
            >
              実績を見る
            </Link>
            <a
              href={consultUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="クラウドワークスで無料相談する。新しいタブで開きます"
              className="btn-consult inline-flex min-h-11 items-center justify-center px-6 text-center text-base font-bold text-white no-underline"
            >
              【今すぐ無料相談】クラウドワークスで相談する
            </a>
          </div>
        </div>
        <div className="hero-fade w-full md:w-1/2" style={{ animationDelay: "0.12s" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
