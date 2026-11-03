import { SettingsForm } from "@/components/admin/SettingsForm";
import { getPortfolio } from "@/lib/data";

export const metadata = { title: "サイト設定" };

export default async function SettingsPage() {
  const { settings } = await getPortfolio(true);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[32px] font-medium leading-10">サイト設定</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
