import { WorkEditor } from "@/components/admin/WorkEditor";

export const metadata = { title: "実績を追加" };

export default function NewWorkPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-medium leading-10">実績を追加</h1>
      <WorkEditor />
    </div>
  );
}
