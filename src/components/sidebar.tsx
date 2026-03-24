"use client";

import { useState } from "react";
import { 
  Settings, Plus, History, Folder, 
  Box, Layout, PenTool, Scale, Share2, 
  Mail, Youtube, BarChart, Search, 
  UserCircle, Sparkles, Languages, Layers, 
  Zap, Terminal, Palette, Cpu 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const IconMap: Record<string, any> = {
  Layout, PenTool, Scale, Share2, Mail, Youtube, BarChart, 
  Search, UserCircle, Sparkles, Languages, Layers, Zap, 
  Terminal, Palette, Cpu, History, Folder
};

export default function Sidebar({ 
  niches, 
  folders 
}: { 
  niches: any[], 
  folders: any[] 
}) {
  const [activeTab, setActiveTab] = useState("workspace");
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-100 flex flex-col bg-zinc-50/50 h-screen shrink-0">
      {/* Brand */}
      <div className="p-4 flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-heading">
          <span className="text-white font-black text-lg">O</span>
        </div>
        <span className="font-bold text-lg tracking-tight font-heading uppercase">OLLI-E</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-3 py-2 space-y-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2 text-sm font-black uppercase tracking-widest text-white bg-black rounded-xl shadow-xl shadow-black/10 hover:scale-[1.02] transition-all shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          New Chat
        </Link>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-zinc-100/80 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab("workspace")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === "workspace" 
                ? "bg-white text-black shadow-sm" 
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveTab("niches")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === "niches" 
                ? "bg-white text-black shadow-sm" 
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Agents
          </button>
        </div>

        {/* Dynamic List Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 pr-1">
          {activeTab === "workspace" ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Activity</span>
                <Plus className="h-3 w-3 text-zinc-400 hover:text-zinc-900 cursor-pointer" />
              </div>
              <div className="space-y-1">
                <Link
                  href="/dashboard/history"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-white rounded-lg transition-all group"
                >
                  <History className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 shrink-0" />
                  <span className="truncate">Chat History</span>
                </Link>
                {folders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/dashboard/folders/${folder.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-white rounded-lg transition-all group"
                  >
                    <Folder className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 shrink-0" />
                    <span className="truncate flex-1">{folder.name}</span>
                    <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-900">{folder.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="px-3">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Agents</span>
              </div>
              <nav className="space-y-1">
                {niches.map((niche) => {
                  const Icon = IconMap[niche.icon as string] || Box;
                  return (
                    <Link
                      key={niche.id}
                      href={`/dashboard/chat/${niche.id}`}
                      className={`flex items-center gap-3 px-3 py-2 text-sm transition-all group rounded-lg ${
                        pathname?.includes(niche.id) 
                          ? "bg-white text-zinc-900 shadow-sm" 
                          : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 transition-colors ${
                        pathname?.includes(niche.id) ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-900"
                      }`} />
                      <span className="truncate">{niche.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-100 shrink-0">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
            pathname === "/dashboard/settings" ? "bg-white text-black shadow-sm" : "text-zinc-600 hover:text-zinc-900"
          }`}
        >
          <Settings className="h-4 w-4" />
          Integration
        </Link>
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 border border-zinc-100">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-widest leading-none">Local User</span>
            <span className="text-[10px] font-medium text-zinc-400 mt-0.5">Settings</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
