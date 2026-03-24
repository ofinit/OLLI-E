import Sidebar from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let niches = [];
  const isPlaceholderDB = process.env.DATABASE_URL?.includes("username:password") || !process.env.DATABASE_URL;

  const mockFolders = [
    { id: "marketing", name: "Marketing Strategy", count: 4 },
    { id: "legal", name: "Legal Discovery", count: 2 },
    { id: "code", name: "Dev Projects", count: 12 },
  ];

  if (isPlaceholderDB) {
    const { mockNiches } = await import("@/lib/mock-data");
    niches = mockNiches.map(n => ({ id: n.id, name: n.nicheName, icon: n.icon }));
  } else {
    try {
      const { db } = await import("@/db");
      const { aiModels } = await import("@/db/schema");
      const { eq } = await import("drizzle-orm");
      niches = await db
        .select({
          id: aiModels.id,
          name: aiModels.nicheName,
          icon: aiModels.id,
        })
        .from(aiModels)
        .where(eq(aiModels.isActive, true));
    } catch (e) {
      const { mockNiches } = await import("@/lib/mock-data");
      niches = mockNiches.map(n => ({ id: n.id, name: n.nicheName, icon: n.icon }));
    }
  }

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans overflow-hidden">
      <Sidebar niches={niches} folders={mockFolders} />

      {/* Main Content */}
      <main className="flex-1 bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 flex flex-col">
        {children}
      </main>
    </div>
  );
}
