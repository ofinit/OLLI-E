"use client";

import { useState, useRef } from "react";
import { 
  Search, Globe, FileText, Image, Terminal, Zap, 
  ChevronRight, Paperclip, X, Plus, Github, 
  Layers, Image as ImageIcon, BookOpen, Command, 
  Plug, ChevronLeft, MessageSquare, Palette, FolderOpen,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthModal, S3ConfigModal } from "@/components/config-modals";
import { mockUser } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HomeClient({ niches }: { niches: { id: string, name: string }[] }) {
  const [prompt, setPrompt] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<{ name: string, type: string }[]>([]);
  const [isS3Configured, setIsS3Configured] = useState(mockUser.isS3Configured);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showS3Modal, setShowS3Modal] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [generateImages, setGenerateImages] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && attachedFiles.length === 0) return;
    // Default chat fallback if they use the wide search
    const fallbackNicheId = niches.length > 0 ? niches[0].id : "general";
    router.push(`/dashboard/chat/${fallbackNicheId}?q=${encodeURIComponent(prompt)}`);
  };

  const handleAttachClick = () => {
    const isLoggedIn = true;
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    if (!isS3Configured) {
      setShowS3Modal(true);
      return;
    }

    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 -mt-20">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Logo */}
        <h1 className="text-7xl font-black tracking-tight text-zinc-900 uppercase font-heading">
          OLLI-E
        </h1>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-zinc-200/50 rounded-3xl blur-xl group-focus-within:bg-zinc-300/50 transition-all" />
          
          {/* File Previews */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {attachedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-zinc-200 px-4 py-2 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-2">
                  <FileText className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-600 truncate max-w-[150px]">{file.name}</span>
                  <button 
                    onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="p-1 hover:bg-zinc-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex items-center bg-white border border-zinc-200 rounded-3xl p-2 pl-3 shadow-sm focus-within:ring-4 focus-within:ring-zinc-900/5 transition-all"
          >
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files).map(f => ({ name: f.name, type: f.type }));
                  setAttachedFiles(prev => [...prev, ...files]);
                }
              }}
            />
            
            {/* POWER MENU BUTTON */}
            <div className="relative">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setShowPowerMenu(!showPowerMenu)}
                className={`h-12 w-12 shrink-0 rounded-2xl transition-all ${
                  showPowerMenu ? "bg-zinc-900 text-white rotate-45" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Plus className="h-6 w-6" />
              </Button>

              {/* DROPDOWN POWER MENU */}
              {showPowerMenu && (
                <div className="absolute top-full left-0 mt-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-zinc-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                  <div className="space-y-1">
                    <button 
                      onClick={() => { handleAttachClick(); setShowPowerMenu(false); }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-2xl transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Upload from computer</span>
                    </button>

                    <button 
                      onClick={() => router.push('/dashboard/chat/code-generator?q='+encodeURIComponent('I need to connect my GitHub repository. Please guide me.'))}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <Github className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Import from GitHub</span>
                      </div>
                    </button>

                    <button 
                      onClick={() => alert('Figma API Connection Requires a PREMIUM OLLI-E Account.')}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <Layers className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Create from Figma</span>
                      </div>
                      <Badge className="bg-blue-50 text-blue-600 text-[8px] border-none px-1.5 h-4 font-black">PREMIUM</Badge>
                    </button>

                    <div className="h-px bg-zinc-100 my-2 mx-2" />

                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Generate Images</span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer" onClick={() => setGenerateImages(!generateImages)}>
                        <div className={`w-8 h-4 rounded-full transition-colors ${generateImages ? "bg-green-500" : "bg-zinc-200"}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${generateImages ? "left-4" : "left-0.5"}`} />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => router.push('/dashboard/chat/website-builder?q='+encodeURIComponent('Please review and sync my current Design System tokens.'))}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <Palette className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Design System</span>
                      </div>
                      <ChevronLeft className="h-3 w-3 text-zinc-300 rotate-180" />
                    </button>

                    <button 
                      onClick={() => alert('Local directory syncing is experimental. Please drag & drop files manually for now.')}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Folder</span>
                      </div>
                      <ChevronLeft className="h-3 w-3 text-zinc-300 rotate-180" />
                    </button>

                    <button 
                      onClick={() => router.push('/dashboard/chat/agent-swarm?q='+encodeURIComponent('Configure custom agent instructions for this niche.'))}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Instructions</span>
                      </div>
                      <ChevronLeft className="h-3 w-3 text-zinc-300 rotate-180" />
                    </button>

                    <button 
                      onClick={() => router.push('/dashboard/chat/code-generator?q='+encodeURIComponent('List available Model Context Protocol (MCP) servers available on my device.'))}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <Command className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">MCPs</span>
                      </div>
                      <ChevronLeft className="h-3 w-3 text-zinc-300 rotate-180" />
                    </button>
                    
                    <Link 
                      href="/dashboard/settings"
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                       <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <Plug className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">All Integrations</span>
                      </div>
                      <ChevronLeft className="h-3 w-3 text-zinc-300 rotate-180" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder="Ask Anything..."
              className="flex-1 bg-transparent py-4 pl-2 outline-none text-xl text-zinc-900 placeholder:text-zinc-400"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button type="submit" className="bg-zinc-100 hover:bg-zinc-200 p-4 rounded-2xl transition-colors">
              <Search className="h-6 w-6 text-zinc-400" />
            </button>
          </form>
        </div>

        {/* Auth & Config Modals */}
        <AuthModal isOpen={showAuthModal} onOpenChange={setShowAuthModal} />
        <S3ConfigModal 
          isOpen={showS3Modal} 
          onOpenChange={setShowS3Modal} 
          onSuccess={() => setIsS3Configured(true)} 
        />

        {/* Niche Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {niches.map((niche) => (
            <Link
              key={niche.id}
              href={`/dashboard/chat/${niche.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              <BrainCircuit className="h-4 w-4 text-zinc-400" />
              {niche.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
