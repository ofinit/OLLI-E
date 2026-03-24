"use server";

import { db } from "@/db";
import { platformSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const settings = await db.select().from(platformSettings).limit(1);
  
  if (settings.length === 0) {
    const inserted = await db.insert(platformSettings).values({}).returning();
    return inserted[0];
  }
  
  return settings[0];
}

export async function saveSettings(data: Partial<typeof platformSettings.$inferInsert>) {
  const current = await getSettings();
  
  await db.update(platformSettings).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(platformSettings.id, current.id));
  
  revalidatePath("/admin/settings");
  return { success: true };
}
