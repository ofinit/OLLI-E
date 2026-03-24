"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, CreditCard, Landmark, Wallet } from "lucide-react";

import { db } from "@/db";
import { users, wallets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mockUser } from "@/lib/mock-data";
import { WalletClient } from "./wallet-client";

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  let currentBalance = "0.00"; 
  try {
    const [u] = await db.select().from(users).where(eq(users.clerkId, mockUser.clerkId)).limit(1);
    if (u) {
      const [w] = await db.select().from(wallets).where(eq(wallets.userId, u.id)).limit(1);
      if (w) currentBalance = Number(w.balance).toFixed(2);
    }
  } catch(e) {
    console.error("Wallet lookup failed", e);
  }

  return <WalletClient initialBalance={`$${currentBalance}`} />;
}
      

