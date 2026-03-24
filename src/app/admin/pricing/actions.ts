"use server";

import { db } from "@/db";
import { platformSettings, depositBonuses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSettings } from "../settings/actions";

export async function savePricingSettings(data: {
  globalMarkup: number;
  smartRounding: boolean;
  wholesaleEnabled: boolean;
  wholesaleThreshold: string;
  wholesaleDiscountRate: number;
}) {
  const current = await getSettings();
  await db.update(platformSettings).set({
    globalMarkup: data.globalMarkup,
    smartRounding: data.smartRounding,
    wholesaleEnabled: data.wholesaleEnabled,
    wholesaleThreshold: data.wholesaleThreshold,
    wholesaleDiscountRate: data.wholesaleDiscountRate,
    updatedAt: new Date(),
  }).where(eq(platformSettings.id, current.id as string));
  
  revalidatePath("/admin/pricing");
  return { success: true };
}

export async function addDepositBonus(data: {
  depositAmount: string;
  bonusType: string;
  bonusValue: string;
  isBestValue: boolean;
}) {
  await db.insert(depositBonuses).values({
    depositAmount: data.depositAmount,
    bonusType: data.bonusType,
    bonusValue: data.bonusValue,
    isBestValue: data.isBestValue,
  });
  revalidatePath("/admin/pricing");
  return { success: true };
}

export async function removeDepositBonus(id: string) {
  await db.delete(depositBonuses).where(eq(depositBonuses.id, id));
  revalidatePath("/admin/pricing");
  return { success: true };
}
