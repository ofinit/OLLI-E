"use client";

import { 
  Paperclip, Send, User, Bot, 
  ChevronLeft, ArrowLeft, MoreHorizontal, 
  X, Check, Plus, Globe, ExternalLink, 
  Zap, Plug, Settings, Layout, 
  PenTool, Scale, Share2, Mail, 
  Youtube, BarChart, Search, UserCircle, 
  Sparkles, Languages, Layers, Terminal, 
  Palette, Cpu, Mic, MicOff, Download, FileText, Code2, Coins, Box, MessageSquare,
  FileCode, Database, Cloud, Edit3, Image as ImageIcon, Video, Briefcase, GraduationCap,
  Github, Command, BookOpen, ToggleRight, Trash2, FolderOpen
} from "lucide-react";
import Link from "next/link";
import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { mockUser } from "@/lib/mock-data";
import { AuthModal, S3ConfigModal } from "@/components/config-modals";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const PREDEFINED_PROMPTS: Record<string, string[]> = {
  "deep-research": [
    "I need to research a topic but don't know where to start. Can you walk me through how you'd approach finding reliable information on [my topic]?",
    "What are the most important things to know about solid-state batteries in 2025?",
    "Find and summarize recent trends in the Indian startup ecosystem."
  ],
  "agent-swarm": [
    "I have a big project but I'm overwhelmed. Can you break it down into manageable steps for me?",
    "Deploy a team of agents to research, plan, and draft a complete digital marketing strategy for a new product.",
    "Analyze my business idea and produce a complete SWOT analysis, market sizing, and first steps."
  ],
  "code-generator": [
    "I'm new to coding. Can you teach me step by step how to build a simple website?",
    "Write a complete responsive landing page with HTML, CSS and a contact form.",
    "Review this code and explain any bugs or improvements in simple language."
  ],
  "website-builder": [
    "I want a website but I'm not technical. Ask me questions to understand what I need, then help me build it.",
    "Create a high-converting SaaS landing page with a hero section, features, pricing, and footer.",
    "Generate a portfolio website for a freelance photographer."
  ],
  "data-analyst": [
    "I have a spreadsheet of sales data. Walk me through how to find the most important insights.",
    "Explain what data analytics means and how I can use it for my small business.",
    "I'll paste some numbers — can you help me understand what story they tell?"
  ],
  "seo-optimizer": [
    "My website gets no traffic. Ask me about my business and help me fix my SEO step by step.",
    "Write SEO-optimized meta titles and descriptions for my website about [topic].",
    "What are the top 10 keywords I should target for a bakery in Mumbai?"
  ],
  "content-writer": [
    "I need a blog post but don't know how to write. Ask me questions and write it for me.",
    "Write a 1000-word article about the benefits of meditation for beginners.",
    "Create 5 catchy headlines for a fitness brand's Instagram campaign."
  ],
  "image-crafter": [
    "I want an image for my business. Describe what I should ask for and then generate it.",
    "Generate a professional banner for a tech startup called 'NexaAI' in dark blue tones.",
    "Create a vibrant social media post image for a summer sale promotion."
  ],
  "storyteller": [
    "I have a story idea but I don't know how to develop it. Ask me about it and help me build it.",
    "Write the opening chapter of a thriller set in a futuristic Mumbai.",
    "Create a short children's story about a curious robot who learns about friendship."
  ],
  "youtube-scripts": [
    "I want to start a YouTube channel. Ask me about my niche and help me plan my first 5 videos.",
    "Write a script for a 10-minute video about 'How to make money with AI in 2025'.",
    "Create a viral-style hook and intro for a tech review video."
  ],
  "product-manager": [
    "I have a product idea. Walk me through the steps to turn it into a real product, from zero.",
    "Write a complete PRD (Product Requirements Document) for a mobile app that tracks daily habits.",
    "Help me define user stories and acceptance criteria for a SaaS onboarding flow."
  ],
  "social-media": [
    "I want to grow on social media but I don't know where to start. Ask me about my business and make a plan.",
    "Create a 30-day social media content calendar for a fitness coach on Instagram.",
    "Write 5 LinkedIn posts that establish thought leadership for a B2B SaaS founder."
  ],
  "email-architect": [
    "I want to do email outreach but I've never done it before. Guide me step by step.",
    "Write a 5-email cold outreach sequence for selling a digital marketing service to small businesses.",
    "Create a newsletter welcome email for a health and wellness brand."
  ],
  "resume-pro": [
    "I want to update my resume. Ask me about my experience and help me write a professional one.",
    "Rewrite this bullet point to make it sound more impressive: 'Managed a team of 5'",
    "Write a cover letter for a software engineer applying to a startup."
  ],
  "legal-companion": [
    "I received a contract and I'm confused. Walk me through how to read and understand it.",
    "Explain what an NDA (Non-Disclosure Agreement) is in simple terms and what I should watch out for.",
    "What are the key clauses to look for in a freelance service agreement?"
  ],
  "language-tutor": [
    "I want to learn a new language but don't know how to start. Ask me which language and my level, then teach me.",
    "Teach me the 50 most common phrases in Spanish for a beginner traveling to Spain.",
    "Correct my grammar in this text and explain each mistake in simple terms."
  ],
};

const DEFAULT_PROMPTS = [
  "I'm new here. Can you ask me what I need and guide me step by step?",
  "Help me brainstorm ideas for my next project.",
  "Ask me questions to understand my goal, then create an action plan."
];

const IconMap: Record<string, any> = {
  Layout, PenTool, Scale, Share2, Mail, Youtube, BarChart, 
  Search, UserCircle, Sparkles, Languages, Layers, Zap, 
  Terminal, Palette, Cpu
};

export function ChatClient({ nicheId, niche, isS3Configured: initialS3, walletBalance }: { nicheId: string, niche: any, isS3Configured: boolean, walletBalance: string }) {
  // Use DB id for unique lookup, fallback to generic Box if icon undefined
  const NicheIcon = IconMap[niche.icon as string] || Box;

  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string, type: string, content?: string }[]>([]);
  const [isS3Configured, setIsS3Configured] = useState(initialS3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showS3Modal, setShowS3Modal] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [generateImages, setGenerateImages] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);

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

  const { messages, input, handleInputChange, isLoading, setInput, append } = useChat({
    api: "/api/chat",
    body: { nicheId: niche.id, generateImages },
    onError: (e) => {
      alert(`Chat Error: ${e.message}`);
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("q");
      if (q) {
        append({ role: 'user', content: q });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [append]);

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;
    
    let finalInput = input;
    if (attachedFiles.length > 0) {
      const fileData = attachedFiles.map(f => `\n\n--- FILE EXTRACT: ${f.name} ---\n${f.content || '[Binary format not readable]'}\n--- END FILE ---`).join('');
      finalInput += fileData;
    }

    append({
      role: 'user',
      content: finalInput,
    });

    setInput('');
    setAttachedFiles([]);
    setShowPowerMenu(false);
  };

  // — Voice-to-Text (Web Speech API) —
  const toggleVoice = () => {
    const SRClass =
      (typeof window !== "undefined" &&
        ((window as any)["SpeechRecognition"] ||
        (window as any)["webkitSpeechRecognition"]));

    if (!SRClass) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }
    if (isListening) {
      (recognitionRef.current as any)?.stop();
      setIsListening(false);
    } else {
      const rec = new SRClass();
      rec.lang = "en-IN";
      rec.interimResults = false;
      rec.onresult = (e: any) => {
        setInput((prev: string) => prev + " " + e.results[0][0].transcript);
      };
      rec.onend = () => setIsListening(false);
      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
    }
  };

  const exportAsText = (content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `olli-e-output-${Date.now()}.txt`;
    a.click();
  };

  const exportAsHTML = (content: string) => {
    const html = `<html><head><meta charset='UTF-8'><title>OLLI-E Export</title></head><body style='font-family:sans-serif;max-width:800px;margin:auto;padding:2rem;'><pre style='white-space:pre-wrap;'>${content}</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `olli-e-output-${Date.now()}.html`;
    a.click();
  };

  // Check if we have mapped predefined prompts by lowercasing the name
  let promptList = DEFAULT_PROMPTS;
  const matchName = niche.nicheName.toLowerCase().replace(" ", "-");
  if (PREDEFINED_PROMPTS[matchName]) {
    promptList = PREDEFINED_PROMPTS[matchName];
  } else if (PREDEFINED_PROMPTS[nicheId]) { // Fallback to hardcoded mock nicheId if passed
    promptList = PREDEFINED_PROMPTS[nicheId];
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Dynamic Header */}
      <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 bg-white shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-zinc-100 rounded-xl transition-colors group">
            <ArrowLeft className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900" />
          </Link>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                <NicheIcon className="h-5 w-5 text-zinc-900" />
             </div>
             <div>
                <h2 className="text-sm font-black uppercase tracking-widest leading-none mb-1 text-black">{niche.nicheName}</h2>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Expert Mode Active</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live DB Wallet Tracker */}
          <Link href="/dashboard/wallet" className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-zinc-50 px-4 py-2 hover:bg-zinc-100 rounded-lg border border-zinc-100 mr-2 transition-all">
            <Coins className="h-4 w-4 text-blue-500" />
            <span className="font-bold text-black">${Number(walletBalance).toFixed(2)}</span>
          </Link>

          {/* Connectivity Hub Shortcut */}
          <Button 
            variant="ghost" 
            onClick={() => setShowIntegrations(true)}
            className="h-10 px-4 rounded-xl flex items-center gap-2 text-zinc-600 hover:text-black hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <Plug className="h-4 w-4" />
            Connectivity
          </Button>

          {/* Hidden Dialog Trigger (Managed by Button) */}
          <Dialog open={showIntegrations} onOpenChange={setShowIntegrations}>
            <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 border-none overflow-hidden bg-white shadow-2xl">
               <div className="p-10">
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl font-black font-heading uppercase tracking-tighter text-black">Link {niche.nicheName} Skills</DialogTitle>
                    <p className="text-zinc-500 font-medium pt-2">Connect your brand accounts to give this specialist some "teeth." Once linked, it can post, schedule, and read data on your behalf.</p>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Common Team Skill */}
                    <div className="col-span-2 p-6 bg-zinc-50 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-100 shadow-sm group-hover:bg-zinc-900 group-hover:text-white transition-all">
                          <MessageSquare className="h-5 w-5 text-black group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-black leading-tight">Link Team Slack</p>
                          <p className="text-[10px] text-zinc-400 font-medium tracking-tight">Broadcast outputs to #general</p>
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                    </div>

                    <div className="col-span-2 p-12 bg-zinc-50 rounded-3xl border-dashed border-2 border-zinc-200 text-center">
                        <Globe className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
                        <p className="text-zinc-400 font-black uppercase tracking-widest text-[10px]">OLLI-E Native Chat is fully optimized for external plugin integrations.</p>
                    </div>
                  </div>
               </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-zinc-100">
            <MoreHorizontal className="h-5 w-5 text-zinc-400" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                <NicheIcon className="h-10 w-10 text-zinc-900" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">
                {niche.nicheName}
              </h2>
              <p className="text-zinc-500 text-base max-w-sm mx-auto text-center mb-10 leading-relaxed">
                Your specialized assistant is ready. Choose a prompt below or type your own to begin.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-2">
                {promptList.map((promptText, i) => (
                  <button
                    key={i}
                    onClick={() => append({ role: 'user', content: promptText })}
                    className="p-5 bg-white border border-zinc-200 rounded-[1.5rem] text-left hover:border-zinc-900 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between min-h-[140px]"
                  >
                    <p className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 leading-snug">
                      "{promptText}"
                    </p>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 group-hover:bg-zinc-900 flex items-center justify-center mt-4 transition-colors">
                      <ChevronLeft className="h-4 w-4 text-zinc-400 group-hover:text-white rotate-180 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                  m.role === "assistant" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {m.role === "assistant" ? "K" : "U"}
              </div>
              <div className="flex flex-col gap-2 max-w-[85%]">
                <div
                  className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
                    m.role === "user"
                      ? "bg-zinc-900 text-white"
                      : "bg-white border border-zinc-100 text-zinc-800 shadow-sm"
                  }`}
                >
                  {m.content}
                </div>
                
                {/* 1-Click Export buttons for assistant messages */}
                {m.role === "assistant" && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-[11px] text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 gap-1.5 px-2"
                      onClick={() => exportAsText(m.content)}
                    >
                      <FileText className="h-3.5 w-3.5" /> Text
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-[11px] text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 gap-1.5 px-2"
                      onClick={() => exportAsHTML(m.content)}
                    >
                      <Code2 className="h-3.5 w-3.5" /> HTML
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-[11px] text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 gap-1.5 px-2"
                      onClick={() => navigator.clipboard.writeText(m.content)}
                    >
                      <Download className="h-3.5 w-3.5" /> Copy
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center animate-pulse">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="px-5 py-3 bg-white border border-zinc-100 rounded-2xl flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white px-6 pb-8 pt-2">
        <form
          onSubmit={handleCustomSubmit}
          className="max-w-3xl mx-auto relative"
        >
          {/* File Previews */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600">
                  <FileText className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button 
                    type="button"
                    onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    className="p-0.5 hover:bg-zinc-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-end gap-2 bg-white border border-zinc-200 rounded-3xl p-3 shadow-sm focus-within:ring-4 focus-within:ring-zinc-900/5 transition-all">
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              multiple
              onChange={async (e) => {
                if (e.target.files) {
                  const filesArray = Array.from(e.target.files);
                  const newFiles = await Promise.all(
                    filesArray.map(async (f) => {
                      try {
                        const content = await f.text();
                        return { name: f.name, type: f.type, content: content.slice(0, 15000) };
                      } catch {
                        return { name: f.name, type: f.type, content: "[Format unsupported]" };
                      }
                    })
                  );
                  setAttachedFiles(prev => [...prev, ...newFiles]);
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
                className={`h-10 w-10 shrink-0 rounded-2xl transition-all ${
                  showPowerMenu ? "bg-zinc-900 text-white rotate-45" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Plus className="h-6 w-6" />
              </Button>

              {/* FLOATING POWER MENU */}
              {showPowerMenu && (
                <div className="absolute bottom-full left-0 mb-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-zinc-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
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
                      onClick={() => { append({ role: 'user', content: 'I need to connect my GitHub repository. Please guide me.' }); setShowPowerMenu(false); }}
                      className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                          <Github className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Import from GitHub</span>
                      </div>
                    </button>

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
                  </div>
                </div>
              )}
            </div>

            <textarea
              className="flex-1 bg-transparent px-3 py-2 text-[15px] text-zinc-900 placeholder:text-zinc-400 resize-none outline-none min-h-[44px] max-h-[200px]"
              placeholder={`Ask anything about ${niche.nicheName}...`}
              value={input}
              onChange={handleInputChange}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
            />
            <div className="flex gap-1.5 pb-1 pr-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={toggleVoice}
                className={`h-10 w-10 rounded-2xl ${isListening ? "text-red-500 bg-red-50 animate-pulse" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"}`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
                className="h-10 w-10 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-20 transition-all shadow-md"
              >
                <Send className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-400 mt-3 font-medium uppercase tracking-widest">
            Specialized {niche.nicheName} Intelligence
          </p>
        </form>
      </div>

      {/* Auth & Config Modals */}
      <AuthModal isOpen={showAuthModal} onOpenChange={setShowAuthModal} />
      <S3ConfigModal 
        isOpen={showS3Modal} 
        onOpenChange={setShowS3Modal} 
        onSuccess={() => setIsS3Configured(true)} 
      />
    </div>
  );
}
