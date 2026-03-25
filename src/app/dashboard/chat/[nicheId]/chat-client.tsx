"use client";

import { 
  Paperclip, Send,
  ChevronLeft, ArrowLeft, MoreHorizontal, 
  X, Check, Plus, Globe,
  Zap, Plug, Layout, 
  PenTool, Scale, Share2, Mail, 
  Youtube, BarChart, Search, UserCircle, 
  Sparkles, Languages, Layers, Terminal, 
  Palette, Cpu, Mic, MicOff, Download, FileText, Code2, Coins, Box, MessageSquare,
  Github, Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { AuthModal, S3ConfigModal } from "@/components/config-modals";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";

// ─── Predefined Prompts ────────────────────────────────────────────────────
const PREDEFINED_PROMPTS: Record<string, string[]> = {
  "deep-research": [
    "I need to research a topic but don't know where to start. Can you walk me through how you'd approach it?",
    "What are the most important things to know about solid-state batteries in 2025?",
    "Find and summarize recent trends in the Indian startup ecosystem.",
  ],
  "agent-swarm": [
    "I have a big project but I'm overwhelmed. Can you break it down into manageable steps?",
    "Deploy a team of agents to research, plan, and draft a complete digital marketing strategy.",
    "Analyze my business idea and produce a SWOT analysis, market sizing, and first steps.",
  ],
  "code-generator": [
    "I'm new to coding. Can you teach me step by step how to build a simple website?",
    "Write a complete responsive landing page with HTML, CSS and a contact form.",
    "Review this code and explain any bugs or improvements in simple language.",
  ],
  "website-builder": [
    "I want a website but I'm not technical. Ask me questions and help me build it.",
    "Create a high-converting SaaS landing page with hero, features, pricing and footer.",
    "Generate a portfolio website for a freelance photographer.",
  ],
  "data-analyst": [
    "I have a spreadsheet of sales data. Walk me through how to find the most important insights.",
    "Explain what data analytics means and how I can use it for my small business.",
    "I'll paste some numbers — can you help me understand what story they tell?",
  ],
  "seo-optimizer": [
    "My website gets no traffic. Ask me about my business and help me fix my SEO step by step.",
    "Write SEO-optimized meta titles and descriptions for my website about [topic].",
    "What are the top 10 keywords I should target for a bakery in Mumbai?",
  ],
  "content-writer": [
    "I need a blog post but don't know how to write. Ask me questions and write it for me.",
    "Write a 1000-word article about the benefits of meditation for beginners.",
    "Create 5 catchy headlines for a fitness brand's Instagram campaign.",
  ],
  "image-crafter": [
    "I want an image for my business. Describe what I should ask for and then generate it.",
    "Generate a professional banner for a tech startup called 'NexaAI' in dark blue tones.",
    "Create a vibrant social media post image for a summer sale promotion.",
  ],
  "storyteller": [
    "I have a story idea but I don't know how to develop it. Ask me about it and help me build it.",
    "Write the opening chapter of a thriller set in a futuristic Mumbai.",
    "Create a short children's story about a curious robot who learns about friendship.",
  ],
  "youtube-scripts": [
    "I want to start a YouTube channel. Ask me about my niche and help me plan my first 5 videos.",
    "Write a script for a 10-minute video about 'How to make money with AI in 2025'.",
    "Create a viral-style hook and intro for a tech review video.",
  ],
  "product-manager": [
    "I have a product idea. Walk me through the steps to turn it into a real product, from zero.",
    "Write a complete PRD for a mobile app that tracks daily habits.",
    "Help me define user stories and acceptance criteria for a SaaS onboarding flow.",
  ],
  "social-media": [
    "I want to grow on social media. Ask me about my business and make a plan.",
    "Create a 30-day social media content calendar for a fitness coach on Instagram.",
    "Write 5 LinkedIn posts that establish thought leadership for a B2B SaaS founder.",
  ],
  "email-architect": [
    "I want to do email outreach but I've never done it before. Guide me step by step.",
    "Write a 5-email cold outreach sequence for selling a digital marketing service.",
    "Create a newsletter welcome email for a health and wellness brand.",
  ],
  "resume-pro": [
    "I want to update my resume. Ask me about my experience and help me write a professional one.",
    "Rewrite this bullet point to make it sound more impressive: 'Managed a team of 5'",
    "Write a cover letter for a software engineer applying to a startup.",
  ],
  "legal-companion": [
    "I received a contract and I'm confused. Walk me through how to read and understand it.",
    "Explain what an NDA is in simple terms and what I should watch out for.",
    "What are the key clauses to look for in a freelance service agreement?",
  ],
  "language-tutor": [
    "I want to learn a new language but don't know how to start. Ask me which one and my level, then teach me.",
    "Teach me the 50 most common phrases in Spanish for a beginner traveling to Spain.",
    "Correct my grammar in this text and explain each mistake in simple terms.",
  ],
};

const DEFAULT_PROMPTS = [
  "I'm new here. Can you ask me what I need and guide me step by step?",
  "Help me brainstorm ideas for my next project.",
  "Ask me questions to understand my goal, then create an action plan.",
];

const IconMap: Record<string, any> = {
  Layout, PenTool, Scale, Share2, Mail, Youtube, BarChart,
  Search, UserCircle, Sparkles, Languages, Layers, Zap,
  Terminal, Palette, Cpu
};

// ─── Markdown Renderer ─────────────────────────────────────────────────────
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const patterns = [
    { re: /!\[([^\]]*)\]\(([^)]+)\)/, render: (m: RegExpExecArray) => <img key={m.index} src={m[2]} alt={m[1]} className="max-w-full rounded-xl my-2 shadow-sm" /> },
    { re: /`([^`]+)`/, render: (m: RegExpExecArray) => <code key={m.index} className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-[13px] font-mono">{m[1]}</code> },
    { re: /\*\*\*(.+?)\*\*\*/, render: (m: RegExpExecArray) => <strong key={m.index}><em>{m[1]}</em></strong> },
    { re: /\*\*(.+?)\*\*/, render: (m: RegExpExecArray) => <strong key={m.index} className="font-semibold text-zinc-900">{m[1]}</strong> },
    { re: /__(.+?)__/, render: (m: RegExpExecArray) => <strong key={m.index} className="font-semibold text-zinc-900">{m[1]}</strong> },
    { re: /\*(.+?)\*/, render: (m: RegExpExecArray) => <em key={m.index}>{m[1]}</em> },
    { re: /_(.+?)_/, render: (m: RegExpExecArray) => <em key={m.index}>{m[1]}</em> },
  ];

  let remaining = text;
  let keyIdx = 0;
  while (remaining.length > 0) {
    let earliest: { idx: number; match: RegExpExecArray; render: (m: RegExpExecArray) => React.ReactNode } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.idx)) {
        earliest = { idx: m.index, match: m, render: p.render };
      }
    }
    if (!earliest) {
      parts.push(<span key={keyIdx++}>{remaining}</span>);
      break;
    }
    if (earliest.idx > 0) {
      parts.push(<span key={keyIdx++}>{remaining.slice(0, earliest.idx)}</span>);
    }
    parts.push(earliest.render(earliest.match));
    remaining = remaining.slice(earliest.idx + earliest.match[0].length);
    keyIdx++;
  }
  return parts;
}

function MarkdownMessage({ content, isUser }: { content: string; isUser: boolean }) {
  if (isUser) {
    return <span className="whitespace-pre-wrap break-words">{content}</span>;
  }

  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let bulletBuffer: string[] = [];
  let orderedBuffer: { num: string; text: string }[] = [];
  let codeBuffer: string[] = [];
  let inCode = false;
  let codeLang = '';

  const flushBullets = (key: number) => {
    if (bulletBuffer.length === 0) return;
    nodes.push(
      <ul key={`ul-${key}`} className="list-none space-y-1.5 my-2 pl-0">
        {bulletBuffer.map((item, bi) => (
          <li key={bi} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
            <span>{renderInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  const flushOrdered = (key: number) => {
    if (orderedBuffer.length === 0) return;
    nodes.push(
      <ol key={`ol-${key}`} className="space-y-1.5 my-2 pl-0">
        {orderedBuffer.map((item, oi) => (
          <li key={oi} className="flex items-start gap-2.5">
            <span className="text-xs font-bold text-zinc-400 mt-0.5 w-5 shrink-0 text-right">{item.num}.</span>
            <span>{renderInline(item.text)}</span>
          </li>
        ))}
      </ol>
    );
    orderedBuffer = [];
  };

  const flushCode = (key: number) => {
    if (codeBuffer.length === 0) return;
    nodes.push(
      <div key={`code-${key}`} className="my-3 rounded-xl overflow-hidden border border-zinc-200">
        {codeLang && <div className="bg-zinc-800 px-4 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{codeLang}</div>}
        <pre className="bg-zinc-900 text-green-300 p-4 overflow-x-auto text-[13px] leading-relaxed font-mono whitespace-pre">
          {codeBuffer.join('\n')}
        </pre>
      </div>
    );
    codeBuffer = [];
    codeLang = '';
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code fence
    if (line.startsWith('```')) {
      if (!inCode) {
        flushBullets(i); flushOrdered(i);
        inCode = true;
        codeLang = line.slice(3).trim();
      } else {
        inCode = false;
        flushCode(i);
      }
      i++; continue;
    }
    if (inCode) { codeBuffer.push(line); i++; continue; }

    // Headings
    const h3 = line.match(/^###\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    const h1 = line.match(/^#\s+(.+)/);
    if (h1 || h2 || h3) {
      flushBullets(i); flushOrdered(i);
      const text = (h1 || h2 || h3)![1];
      if (h1) nodes.push(<h1 key={i} className="text-xl font-black text-zinc-900 mt-5 mb-2 tracking-tight">{renderInline(text)}</h1>);
      else if (h2) nodes.push(<h2 key={i} className="text-lg font-black text-zinc-900 mt-4 mb-1.5 tracking-tight">{renderInline(text)}</h2>);
      else nodes.push(<h3 key={i} className="text-base font-bold text-zinc-800 mt-3 mb-1">{renderInline(text)}</h3>);
      i++; continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushBullets(i); flushOrdered(i);
      nodes.push(<hr key={i} className="my-4 border-zinc-100" />);
      i++; continue;
    }

    // Bullets
    const bullet = line.match(/^[\-\*\•]\s+(.+)/);
    if (bullet) {
      flushOrdered(i);
      bulletBuffer.push(bullet[1]);
      i++; continue;
    }

    // Ordered list
    const ordered = line.match(/^(\d+)\.\s+(.+)/);
    if (ordered) {
      flushBullets(i);
      orderedBuffer.push({ num: ordered[1], text: ordered[2] });
      i++; continue;
    }

    // Blank line
    if (line.trim() === '') {
      flushBullets(i); flushOrdered(i);
      nodes.push(<div key={`br-${i}`} className="h-2" />);
      i++; continue;
    }

    // Regular paragraph
    flushBullets(i); flushOrdered(i);
    nodes.push(<p key={i} className="leading-relaxed text-[15px]">{renderInline(line)}</p>);
    i++;
  }

  flushBullets(lines.length);
  flushOrdered(lines.length);
  flushCode(lines.length);

  return <div className="space-y-0.5">{nodes}</div>;
}

// ─── Question Parser ───────────────────────────────────────────────────────
// Detects lines like: "1. **What is your SaaS product?** (e.g., ...)"
interface Question {
  num: number;
  text: string;           // The question label (stripped of markdown)
  hint?: string;          // e.g. "(e.g., ...)" 
  options?: string[];     // detected from bullet "- " lines immediately after
  type: 'text' | 'select' | 'multiselect';
}

function parseQuestions(content: string): Question[] | null {
  const lines = content.split('\n');
  const questions: Question[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const qMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (qMatch) {
      const num = parseInt(qMatch[1]);
      let raw = qMatch[2];
      // strip bold markers
      raw = raw.replace(/\*\*/g, '').replace(/__/g, '');
      // split hint from question
      const hintMatch = raw.match(/\(([^)]{5,})\)\s*$/);
      const hint = hintMatch ? hintMatch[1] : undefined;
      const text = hintMatch ? raw.slice(0, hintMatch.index).trim().replace(/:?\s*$/, '') : raw.replace(/:?\s*$/, '');

      // Collect bullet options immediately after, skipping empty lines or non-bullet lines and stopping at the next question
      const options: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const optLine = lines[j].trim();
        
        // If we hit the next question, stop looking for options for this one
        if (/^\d+\.\s+/.test(optLine)) {
          break;
        }

        const optMatch = optLine.match(/^[-\*•]\s+(.+)/);
        if (optMatch) {
          options.push(optMatch[1].replace(/\*\*/g, ''));
        }
        
        j++;
      }

      const type = options.length > 0
        ? (options.length > 4 ? 'multiselect' : 'select')
        : 'text';

      questions.push({ num, text, hint, options: options.length > 0 ? options : undefined, type });
      i = j;
    } else {
      i++;
    }
  }

  return questions.length >= 2 ? questions : null;
}

// ─── Interactive Question Form ─────────────────────────────────────────────
function QuestionForm({ questions, onSubmit }: { questions: Question[]; onSubmit: (answers: Record<number, string>) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<Record<number, string[]>>({});

  const toggleOption = (qNum: number, opt: string) => {
    setSelected(prev => {
      const curr = prev[qNum] || [];
      const updated = curr.includes(opt) ? curr.filter(o => o !== opt) : [...curr, opt];
      // sync to answers
      setAnswers(a => ({ ...a, [qNum]: updated.join(', ') }));
      return { ...prev, [qNum]: updated };
    });
  };

  const canSubmit = questions.every(q => {
    const ans = answers[q.num];
    return ans && ans.trim().length > 0;
  });

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(answers);
  };

  return (
    <div className="mt-4 space-y-5 border-t border-zinc-100 pt-4">
      {questions.map(q => (
        <div key={q.num} className="space-y-2">
          <p className="text-sm font-semibold text-zinc-800">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold mr-2">{q.num}</span>
            {q.text}
          </p>
          {q.hint && <p className="text-xs text-zinc-400 ml-7">e.g. {q.hint}</p>}

          {q.options ? (
            <div className="ml-7 flex flex-wrap gap-2">
              {q.options.map(opt => {
                const isSelected = (selected[q.num] || []).includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleOption(q.num, opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-zinc-900'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {opt}
                  </button>
                );
              })}
              {/* Allow typing if "other" or to supplement */}
              <input
                type="text"
                placeholder="or type your answer…"
                value={answers[q.num] && !q.options!.some(o => (selected[q.num] || []).includes(o)) ? answers[q.num] : ''}
                onChange={e => {
                  const val = e.target.value;
                  setAnswers(a => ({ ...a, [q.num]: val }));
                  if (val) setSelected(s => ({ ...s, [q.num]: [] }));
                }}
                className="px-3 py-1.5 rounded-full text-xs border border-dashed border-zinc-300 bg-white text-zinc-800 outline-none focus:border-zinc-500 w-40 placeholder:text-zinc-300"
              />
            </div>
          ) : (
            <input
              type="text"
              placeholder="Type your answer here…"
              value={answers[q.num] || ''}
              onChange={e => setAnswers(a => ({ ...a, [q.num]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter' && canSubmit) { e.preventDefault(); handleSubmit(); } }}
              className="ml-7 w-[calc(100%-1.75rem)] border border-zinc-200 rounded-xl px-4 py-2 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 placeholder:text-zinc-300 bg-white transition-all"
            />
          )}
        </div>
      ))}

      <div className="ml-7">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-black uppercase tracking-widest disabled:opacity-30 hover:bg-black transition-all shadow"
        >
          <Send className="h-3.5 w-3.5" />
          Send Answers
        </button>
      </div>
    </div>
  );
}

// ─── Main Chat Client ──────────────────────────────────────────────────────
export function ChatClient({ 
  nicheId, 
  niche, 
  isS3Configured: initialS3, 
  walletBalance,
  initialMessages = [],
  initialSessionId = null
}: { 
  nicheId: string; 
  niche: any; 
  isS3Configured: boolean; 
  walletBalance: string;
  initialMessages?: any[];
  initialSessionId?: string | null;
}) {
  const NicheIcon = IconMap[niche.icon as string] || Box;

  const [isListening, setIsListening] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string; url?: string; content?: string }[]>([]);
  const [isS3Configured, setIsS3Configured] = useState(initialS3);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showS3Modal, setShowS3Modal] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const [generateImages, setGenerateImages] = useState(false);
  const [answeredMsgIds, setAnsweredMsgIds] = useState<Set<string>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<unknown>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAttachClick = () => {
    if (!isS3Configured) { setShowS3Modal(true); return; }
    fileInputRef.current?.click();
  };

  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);

  const { messages, input, handleInputChange, isLoading, setInput, append } = useChat({
    api: "/api/chat",
    initialMessages,
    body: { nicheId: niche.id, generateImages, sessionId },
    onResponse: (res) => {
      const sid = res.headers.get('X-Session-Id');
      if (sid) setSessionId(sid);
    },
    onError: (e) => {
      alert(`Chat Error: ${e.message}`);
    }
  });

  // Stable scroll: only auto-scroll if user is already near the bottom (within 120px).
  // Uses instant scroll (no smooth) during streaming to prevent the shake.
  const prevMessageCountRef = useRef(0);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isNewMessage = messages.length > prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;
    // Always scroll for a brand-new message; scroll during streaming only if near bottom
    if (isNewMessage || distanceFromBottom < 120) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Handle ?q= query param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      append({ role: 'user', content: q });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [append]);

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() && attachedFiles.length === 0) return;
    let finalInput = input;
    if (attachedFiles.length > 0) {
      const fileData = attachedFiles.map(f =>
        `\n\n--- FILE: ${f.name} ---\n${f.content || '[Binary format not readable]'}\n--- END ---`
      ).join('');
      finalInput += fileData;
    }
    append({ role: 'user', content: finalInput });
    setInput('');
    setAttachedFiles([]);
    setShowPowerMenu(false);
  };

  const handleQuestionFormSubmit = (msgId: string, answers: Record<number, string>) => {
    const composed = Object.entries(answers)
      .map(([num, ans]) => `${num}. ${ans}`)
      .join('\n');
    append({ role: 'user', content: composed });
    setAnsweredMsgIds(prev => new Set([...prev, msgId]));
  };

  const toggleVoice = () => {
    const SRClass = typeof window !== "undefined" &&
      ((window as any)["SpeechRecognition"] || (window as any)["webkitSpeechRecognition"]);
    if (!SRClass) { alert("Voice input requires Chrome."); return; }
    if (isListening) {
      (recognitionRef.current as any)?.stop();
      setIsListening(false);
    } else {
      const rec = new SRClass();
      rec.lang = "en-IN";
      rec.interimResults = false;
      rec.onresult = (e: any) => setInput((prev: string) => prev + " " + e.results[0][0].transcript);
      rec.onend = () => setIsListening(false);
      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
    }
  };

  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Most reliable download: hidden form POST → server sets Content-Disposition: attachment
  // Bypasses ALL Chrome blob/data: URI security restrictions
  const triggerServerDownload = (content: string, filename: string, type: "txt" | "html") => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/download';

    const addField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addField('content', content);
    addField('filename', filename);
    addField('type', type);

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => document.body.removeChild(form), 1000);
  };

  // Clean message content for export (strip internal markers)
  const cleanContent = (raw: string) =>
    raw.replace(/\x00SESSION:[^\x00]+\x00/g, '').replace(/^SESSION:[a-f0-9-]+\s*/g, '').trim();


  // Extract code from markdown code block if present, otherwise return full text
  const extractCode = (raw: string): { code: string; lang: string } => {
    // Match fenced code block: ```lang\n...code...\n```
    const match = raw.match(/```(\w*)\n([\s\S]*?)```/);
    if (match) {
      return { lang: match[1] || 'text', code: match[2].trim() };
    }
    // No code block — return full cleaned text
    return { lang: 'text', code: raw };
  };

  const exportAsText = (rawContent: string) => {
    const { code } = extractCode(rawContent);
    const filename = `OLLI-E_${niche.nicheName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    triggerServerDownload(code, filename, 'txt');
  };

  const exportAsHTML = (rawContent: string) => {
    const { lang, code } = extractCode(rawContent);

    // If the extracted code IS already a valid HTML document, serve it directly
    if (lang === 'html' || code.trimStart().startsWith('<!DOCTYPE') || code.trimStart().startsWith('<html')) {
      const filename = `OLLI-E_${niche.nicheName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.html`;
      triggerServerDownload(code, filename, 'html');
      return;
    }

    // Otherwise wrap with styled export template
    const escaped = code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    const wrapped = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>OLLI-E • ${niche.nicheName} Export</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:900px;margin:3rem auto;padding:0 2rem;color:#111;line-height:1.7}
    pre{background:#f4f4f4;padding:1.5rem;border-radius:8px;overflow-x:auto;font-size:13px;white-space:pre-wrap;word-break:break-word}
    header{border-bottom:2px solid #111;padding-bottom:1rem;margin-bottom:2rem}
    footer{border-top:1px solid #eee;padding-top:1rem;margin-top:3rem;font-size:0.8rem;color:#999}
  </style>
</head>
<body>
  <header><strong>OLLI-E</strong> — ${niche.nicheName} Export &nbsp; <small>${new Date().toLocaleString()}</small></header>
  <pre>${escaped}</pre>
  <footer>Generated by OLLI-E AI Platform • olli-e.vercel.app</footer>
</body>
</html>`;
    const filename = `OLLI-E_${niche.nicheName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.html`;
    triggerServerDownload(wrapped, filename, 'html');
  };

  const copyToClipboard = async (content: string, msgId: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback for older browsers / HTTP
        const ta = document.createElement('textarea');
        ta.value = content;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopyFeedback(msgId);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch {
      alert('Copy failed. Please select the text manually.');
    }
  };


  let promptList = DEFAULT_PROMPTS;
  const matchName = niche.nicheName.toLowerCase().replace(" ", "-");
  if (PREDEFINED_PROMPTS[matchName]) promptList = PREDEFINED_PROMPTS[matchName];
  else if (PREDEFINED_PROMPTS[nicheId]) promptList = PREDEFINED_PROMPTS[nicheId];

  // The last assistant message (only if it's not still loading) to render interactive form
  const lastAssistantMsg = !isLoading
    ? [...messages].reverse().find(m => m.role === 'assistant')
    : undefined;

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
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
          <Link href="/dashboard/wallet" className="flex items-center gap-2 text-sm font-medium text-zinc-600 bg-zinc-50 px-4 py-2 hover:bg-zinc-100 rounded-lg border border-zinc-100 mr-2 transition-all">
            <Coins className="h-4 w-4 text-blue-500" />
            <span className="font-bold text-black">${Number(walletBalance).toFixed(2)}</span>
          </Link>

          <Button
            variant="ghost"
            onClick={() => setShowIntegrations(true)}
            className="h-10 px-4 rounded-xl flex items-center gap-2 text-zinc-600 hover:text-black hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <Plug className="h-4 w-4" /> Connectivity
          </Button>

          <Dialog open={showIntegrations} onOpenChange={setShowIntegrations}>
            <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 border-none overflow-hidden bg-white shadow-2xl">
              <div className="p-10">
                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-black font-heading uppercase tracking-tighter text-black">Link {niche.nicheName} Skills</DialogTitle>
                  <p className="text-zinc-500 font-medium pt-2">Connect accounts to give this specialist some "teeth." Once linked, it can post, schedule, and read data on your behalf.</p>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
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

      {/* Messages Area — native scroll, not ScrollArea */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-zinc-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                <NicheIcon className="h-10 w-10 text-zinc-900" />
              </div>
              <h2 className="text-3xl font-black text-zinc-900 tracking-tight mb-3">{niche.nicheName}</h2>
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
                    <p className="text-sm font-semibold text-zinc-600 group-hover:text-zinc-900 leading-snug">"{promptText}"</p>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 group-hover:bg-zinc-900 flex items-center justify-center mt-4 transition-colors">
                      <ChevronLeft className="h-4 w-4 text-zinc-400 group-hover:text-white rotate-180 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => {
            const isLastAssistant = lastAssistantMsg?.id === m.id;
            const alreadyAnswered = answeredMsgIds.has(m.id);
            const questions = (isLastAssistant && !alreadyAnswered && m.role === 'assistant')
              ? parseQuestions(m.content)
              : null;

            return (
              <div key={m.id} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${m.role === "assistant" ? "bg-black text-white" : "bg-zinc-100 text-zinc-600"}`}>
                  {m.role === "assistant" ? "K" : "U"}
                </div>
                <div className="flex flex-col gap-2 max-w-[85%] min-w-0">
                  <div className={`px-5 py-4 rounded-2xl text-[15px] leading-relaxed break-words overflow-hidden ${
                    m.role === "user"
                      ? "bg-zinc-900 text-white"
                      : "bg-white border border-zinc-100 text-zinc-800 shadow-sm"
                  }`}>
                    <MarkdownMessage content={m.content.replace(/\x00SESSION:[^\x00]+\x00/g, '')} isUser={m.role === 'user'} />
                    
                    {/* Interactive Question Form — only for last assistant message */}
                    {questions && (
                      <QuestionForm
                        questions={questions}
                        onSubmit={(answers) => handleQuestionFormSubmit(m.id, answers)}
                      />
                    )}
                  </div>

                  {/* Export buttons for assistant messages */}
                  {m.role === "assistant" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 text-[11px] text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 gap-1.5 px-2" onClick={() => exportAsText(cleanContent(m.content))}>
                        <FileText className="h-3.5 w-3.5" /> .txt
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-[11px] text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 gap-1.5 px-2" onClick={() => exportAsHTML(cleanContent(m.content))}>
                        <Code2 className="h-3.5 w-3.5" /> .html
                      </Button>
                      <Button size="sm" variant="ghost" className={`h-8 text-[11px] gap-1.5 px-2 transition-all ${copyFeedback === m.id ? 'text-green-600 bg-green-50' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`} onClick={() => copyToClipboard(extractCode(cleanContent(m.content)).code, m.id)}>
                        <Check className={`h-3.5 w-3.5 ${copyFeedback === m.id ? 'opacity-100' : 'opacity-0 absolute'}`} />
                        <Download className={`h-3.5 w-3.5 ${copyFeedback === m.id ? 'opacity-0 absolute' : 'opacity-100'}`} />
                        {copyFeedback === m.id ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center animate-pulse">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="px-5 py-3 bg-white border border-zinc-100 rounded-2xl flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white px-6 pb-8 pt-2 shrink-0">
        <form onSubmit={handleCustomSubmit} className="max-w-3xl mx-auto relative">
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600">
                  <FileText className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button type="button" onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-0.5 hover:bg-zinc-200 rounded-full">
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
                  setIsUploading(true);
                  
                  const newFiles = await Promise.all(
                    filesArray.map(async (f) => {
                      try {
                        // 1. Get Presigned URL
                        const presignRes = await fetch('/api/s3-presign', {
                          method: 'POST',
                          body: JSON.stringify({ filename: f.name, contentType: f.type })
                        });
                        const { signedUrl, key } = await presignRes.json();
                        
                        if (!signedUrl) throw new Error("No signed URL");

                        // 2. Upload to S3
                        await fetch(signedUrl, {
                          method: 'PUT',
                          body: f,
                          headers: { 'Content-Type': f.type }
                        });

                        const s3Url = signedUrl.split('?')[0];

                        return { 
                          name: f.name, 
                          type: f.type, 
                          url: s3Url,
                          content: `[File uploaded to S3: ${s3Url}]` 
                        };
                      } catch (err) {
                        console.error("Upload failed for", f.name, err);
                        // Fallback to text if small, or error
                        if (f.size < 50000) {
                           return { name: f.name, type: f.type, content: (await f.text()).slice(0, 15000) };
                        }
                        return { name: f.name, type: f.type, content: "[Upload failed]" };
                      }
                    })
                  );
                  setAttachedFiles(prev => [...prev, ...newFiles]);
                  setIsUploading(false);
                }
              }}
            />

            {/* Power Menu */}
            <div className="relative">
              <Button
                type="button" size="icon" variant="ghost"
                onClick={() => setShowPowerMenu(!showPowerMenu)}
                className={`h-10 w-10 shrink-0 rounded-2xl transition-all ${showPowerMenu ? "bg-zinc-900 text-white rotate-45" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"}`}
              >
                <Plus className="h-6 w-6" />
              </Button>

              {showPowerMenu && (
                <div className="absolute bottom-full left-0 mb-4 w-72 bg-white rounded-[2rem] shadow-2xl border border-zinc-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="space-y-1">
                    <button onClick={() => { handleAttachClick(); setShowPowerMenu(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-2xl transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Upload from computer</span>
                    </button>

                    <button onClick={() => { append({ role: 'user', content: 'I need to connect my GitHub repository. Please guide me.' }); setShowPowerMenu(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 rounded-2xl transition-colors group text-left">
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white">
                        <Github className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Import from GitHub</span>
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
              placeholder={`Ask anything about ${niche.nicheName}…`}
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
                type="button" size="icon" variant="ghost"
                onClick={toggleVoice}
                className={`h-10 w-10 rounded-2xl ${isListening ? "text-red-500 bg-red-50 animate-pulse" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"}`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                type="submit" size="icon"
                disabled={isLoading || isUploading || (!input.trim() && attachedFiles.length === 0)}
                className="h-10 px-4 rounded-2xl bg-zinc-900 hover:bg-black disabled:opacity-20 transition-all shadow-md flex items-center gap-2"
              >
                {isUploading ? (
                  <Zap className="h-4 w-4 text-amber-500 animate-spin" />
                ) : (
                  <Send className="h-5 w-5 text-white" />
                )}
                {isUploading && <span className="text-[10px] font-black uppercase text-white">Uploading...</span>}
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-zinc-400 mt-3 font-medium uppercase tracking-widest">
            Specialized {niche.nicheName} Intelligence
          </p>
        </form>
      </div>

      <AuthModal isOpen={showAuthModal} onOpenChange={setShowAuthModal} />
      <S3ConfigModal
        isOpen={showS3Modal}
        onOpenChange={setShowS3Modal}
        onSuccess={() => setIsS3Configured(true)}
      />
    </div>
  );
}
