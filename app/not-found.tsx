import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-4 py-16 md:px-6">
      <h1 className="text-[32px] font-medium leading-10">ページが見つかりません</h1>
      <Link href="/">ホームへ戻る</Link>
    </div>
  );
}
