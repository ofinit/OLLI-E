"use client";

import { useState } from "react";
import { 
  History, Search, Trash2, Box, Calendar, 
  MessageSquare, Layout, PenTool, Scale, Share2, 
  Mail, Youtube, BarChart, UserCircle, Sparkles, 
  Languages, Layers, Zap, Terminal, Palette, Cpu 
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const IconMap: Record<string, any> = {
  Layout, PenTool, Scale, Share2, Mail, Youtube, BarChart, 
  SearchIcon: Search, UserCircle, Sparkles, Languages, Layers, Zap, 
  Terminal, Palette, Cpu, History, Box
};

export function HistoryClient({ initialSessions }: { initialSessions: any[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [search, setSearch] = useState("");

  const filtered = sessions.filter(s => 
    (s.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.agentName || "").toLowerCase().includes(search.toLowerCase())
  );

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic UI update
    setSessions(prev => prev.filter(s => s.id !== id));
    
    await fetch('/api/chat-history', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: id })
    });
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg shadow-black/20">
              <History className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl font-black font-heading tracking-tighter text-black uppercase">Chat History</h1>
          </div>
          <p className="text-zinc-500 font-medium">Pick up where you left off. All your specialized agent sessions in one place.</p>
        </div>
        
        <div className="relative w-full md:w-72 shadow-sm rounded-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search conversations..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl focus-visible:ring-black"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white/50 backdrop-blur-sm rounded-[2rem] border border-black/5">
          <MessageSquare className="h-12 w-12 text-zinc-200 mb-4" />
          <h3 className="text-lg font-bold text-black mb-1">No conversations found</h3>
          <p className="text-zinc-500">Start a new chat from the sidebar or adjust your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((session) => {
            const Icon = IconMap[session.agentIcon as string] || Box;
            return (
              <Link 
                key={session.id}
                href={`/dashboard/chat/${session.agentId}?session=${session.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-zinc-100 rounded-2xl hover:border-zinc-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-black group-hover:text-white transition-colors shrink-0">
                    <Icon className="h-5 w-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-zinc-900 truncate text-[15px] mb-0.5 group-hover:text-black">{session.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 rounded-md text-zinc-600 font-bold uppercase tracking-wider text-[10px]">
                        {session.agentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.updatedAt).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-shrink-0 items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                   <Button size="sm" variant="outline" className="h-8 rounded-lg bg-white box-border border-zinc-200 text-black hover:bg-zinc-100 font-bold px-4">
                     Resume
                   </Button>
                   <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={(e) => deleteSession(session.id, e)}
                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50"
                  >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
