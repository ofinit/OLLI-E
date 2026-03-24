"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BrainCircuit, DollarSign, Users, ScrollText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/models", label: "AI Models & Niches", icon: BrainCircuit },
  { href: "/admin/pricing", label: "Pricing & Margins", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/usage", label: "Usage Logs", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-black selection:text-white relative overflow-hidden">
      
      {/* Ambient Light Mode Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 bg-white/60 backdrop-blur-2xl border-r border-black/5 flex flex-col p-4 gap-2 shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative">
        <div className="flex items-center gap-2 px-3 py-4 mb-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-black uppercase">OLLI-E <span className="text-zinc-400 font-bold ml-1">Admin</span></span>
        </div>
        
        <nav className="flex-1 space-y-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all duration-200",
                pathname === item.href
                  ? "bg-black text-white shadow-md shadow-black/10 scale-100"
                  : "text-zinc-500 hover:bg-black/5 hover:text-black hover:scale-[1.02]"
              )}
            >
              <item.icon className={cn("h-4 w-4", pathname === item.href ? "text-white" : "text-zinc-400")} />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="border-t border-black/5 pt-6 px-3 text-xs font-bold tracking-widest uppercase text-zinc-400">
          OLLI-E Admin v2.0
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-10 relative z-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
