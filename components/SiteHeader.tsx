"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] h-20 bg-white">
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-4 px-5 md:px-10">
        <Link href="/" className="text-[18px] leading-none font-bold text-[#2C3E50] no-underline">
          LINE運用・構築パートナー
        </Link>
        <button
          type="button"
          className="inline-flex min-h-11 items-center px-3 text-sm text-[#2C3E50] md:hidden"
          aria-expanded={open}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((value) => !value)}
        >
          メニュー
        </button>
        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-8" aria-label="主要">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[#2C3E50] no-underline transition-opacity duration-300 hover:opacity-70"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/contact"
            className="nav-cta inline-flex min-h-11 items-center bg-[#06C755] px-4 text-sm font-bold text-white no-underline"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-[#E5E5EA] bg-white px-5 py-2 md:hidden" aria-label="主要">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-11 items-center text-sm text-[#2C3E50] no-underline"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="nav-cta mt-2 inline-flex min-h-11 w-full items-center justify-center bg-[#06C755] text-sm font-bold text-white no-underline"
          >
            お問い合わせ
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
