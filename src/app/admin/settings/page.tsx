import { getSettings } from "./actions";
import { SettingsForm } from "./settings-form";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await getSettings();
  
  return <SettingsForm initialData={settings} />;
}
