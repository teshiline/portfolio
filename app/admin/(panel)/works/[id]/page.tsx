import { notFound } from "next/navigation";
import { WorkEditor } from "@/components/admin/WorkEditor";
import { getWorkById } from "@/lib/data";

export const metadata = { title: "実績を編集" };

export default async function EditWorkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = await getWorkById(id);
  if (!work) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-medium leading-10">実績を編集</h1>
      <WorkEditor work={work} />
    </div>
  );
}
