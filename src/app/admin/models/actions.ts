"use server";

import { db } from "@/db";
import { aiModels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addModelAction(data: any) {
  await db.insert(aiModels).values({
    nicheName: data.nicheName,
    providerModelId: data.providerModelId,
    systemPrompt: data.systemPrompt,
    baseCostPer1k: data.baseCostPer1k || "0.00",
    profitMarginPercent: Number(data.profitMarginPercent) || 50,
    isActive: true,
  });
  revalidatePath("/admin/models");
}

export async function updateModelAction(id: string, data: any) {
  await db.update(aiModels).set({
    nicheName: data.nicheName,
    providerModelId: data.providerModelId,
    systemPrompt: data.systemPrompt,
    profitMarginPercent: Number(data.profitMarginPercent),
  }).where(eq(aiModels.id, id));
  revalidatePath("/admin/models");
}

export async function toggleModelStatusAction(id: string, currentStatus: boolean) {
  await db.update(aiModels).set({ isActive: !currentStatus }).where(eq(aiModels.id, id));
  revalidatePath("/admin/models");
}
