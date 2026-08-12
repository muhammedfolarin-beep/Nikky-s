import { getStoreSettings } from "@/lib/actions";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="pt-4 max-w-4xl">
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
