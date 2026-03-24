import { db } from "@/db";
import { depositBonuses } from "@/db/schema";
import { PricingClient } from "./pricing-client";
import { getSettings } from "../settings/actions";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const settings = await getSettings();
  const dbBonuses = await db.select().from(depositBonuses).orderBy(asc(depositBonuses.depositAmount));

  // Serialize decimals to string for Client Component
  const serializedSettings = {
    ...settings,
    wholesaleThreshold: settings.wholesaleThreshold?.toString() || "1000",
  };
  
  const serializedBonuses = dbBonuses.map((b: any) => ({
    ...b,
    depositAmount: b.depositAmount.toString(),
    bonusValue: b.bonusValue.toString(),
  }));

  return <PricingClient initialSettings={serializedSettings} initialBonuses={serializedBonuses} />;
}
