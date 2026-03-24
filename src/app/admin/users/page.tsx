import { db } from "@/db";
import { users, wallets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { UsersClient } from "./users-client";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const dbUsers = await db
    .select({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      balance: wallets.balance,
    })
    .from(users)
    .leftJoin(wallets, eq(users.id, wallets.userId));

  const mappedUsers = dbUsers.map((u: any) => ({
    id: u.id,
    email: u.email,
    joined: new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    balance: parseFloat((u.balance || "0").toString()),
    role: "User", // Will be extended in DB schema later if needed
    status: "Active",
  }));

  return <UsersClient initialUsers={mappedUsers} />;
}
