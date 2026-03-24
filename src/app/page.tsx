"use client";

import Link from "next/link";
import { 
  ChevronRight, Zap, Shield, Globe, Sparkles, 
  Layers, Palette, Terminal, Mail, Cpu, 
  Command, FolderOpen, Image as ImageIcon, Github
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fbfbfd] text-[#1d1d1f] font-sans selection:bg-black selection:text-white overflow-hidden relative">
      
      {/* Ambient Glow Effects (Light Mode Pastels) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-rose-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-teal-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-white/70 backdrop-blur-2xl border-black/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-md">
              <Sparkles className="h-5 w-5 fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase font-heading">OLLI-E</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden md:block text-sm font-semibold text-zinc-500 hover:text-black transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="px-5 py-2.5 bg-black text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-xl">
              Launch Hub
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center text-center min-h-screen z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="flex flex-col items-center w-full"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 border border-black/5 rounded-full text-xs font-black uppercase tracking-widest text-zinc-500 mb-8 backdrop-blur-xl shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              OLLI-E Intelligence Hub v2.0
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter max-w-5xl mx-auto leading-[0.9] text-black pb-4">
              The Ultimate Agent AI Hub.
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto font-medium mt-6 leading-relaxed">
              Unleash a swarm of highly specialized AI autonomous agents. From architecting code to closing sales, OLLI-E abstracts complexity into power.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
              <Link
                href="/dashboard"
                className="group relative px-8 py-5 bg-black text-white rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 overflow-hidden"
              >
                Start Building <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating UI Mockup (Light Mode Glass) */}
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 15 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="mt-24 w-full max-w-5xl mx-auto relative perspective-[2000px] group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbfbfd] via-transparent to-transparent z-20" />
            <div className="w-full h-[500px] border border-black/5 bg-white/40 backdrop-blur-3xl rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col transform-style-3d origin-bottom transition-transform duration-1000 group-hover:rotate-x-0">
              {/* Fake Header */}
              <div className="h-16 border-b border-black/5 flex items-center px-8 gap-4 bg-white/40">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="h-6 w-64 bg-black/5 rounded-full" />
                </div>
              </div>
              <div className="flex-1 flex pointer-events-none">
                {/* Fake Sidebar */}
                <div className="w-64 border-r border-black/5 p-6 space-y-4 bg-white/20">
                  <div className="h-8 bg-black/5 rounded-lg w-full" />
                  <div className="h-8 bg-black/5 rounded-lg w-3/4" />
                  <div className="h-8 bg-black/5 rounded-lg w-5/6" />
                </div>
                {/* Fake Content */}
                <div className="flex-1 p-10 flex flex-col gap-6">
                  <div className="flex items-end gap-4 justify-end">
                    <div className="h-12 w-64 bg-blue-600 rounded-2xl rounded-br-sm shadow-md" />
                    <div className="w-8 h-8 rounded-full bg-black/5" />
                  </div>
                  <div className="flex items-end gap-4">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-md">O</div>
                    <div className="h-32 w-3/4 bg-white/80 backdrop-blur-xl border border-black/5 shadow-sm rounded-2xl rounded-bl-sm p-4 relative overflow-hidden">
                       <div className="space-y-3 relative z-10">
                          <div className="h-4 bg-black/10 rounded w-1/2" />
                          <div className="h-4 bg-black/5 rounded w-full" />
                          <div className="h-4 bg-black/5 rounded w-5/6" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* BENTO GRID: AGENTS SHOWCASE */}
        <section className="py-32 px-6 relative z-10 max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20 space-y-4"
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-black tracking-tighter">An Army of Experts.</motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-500 text-lg max-w-2xl mx-auto">Access specialized AI agents configured for precise, production-ready tasks.</motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {/* Swarm Tile (Large) */}
            <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-2 row-span-2 p-10 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:bg-white/80 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500">
              <div className="space-y-6">
                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Cpu className="h-8 w-8" />
                 </div>
                 <h3 className="text-3xl font-black tracking-tight">Agent Swarm</h3>
                 <p className="text-zinc-500 leading-relaxed text-lg">
                   Why hire one AI when you can hire a team? OLLI-E orchestrates multiple specialized agents working in tandem to solve multi-step, highly complex architectural problems autonomously.
                 </p>
              </div>
              <div className="mt-8 pt-8 border-t border-black/5 flex items-center justify-between text-sm font-black uppercase tracking-widest text-zinc-400 group-hover:text-black transition-colors">
                 Explore Swarm Logic <ChevronRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>

            {/* Code Generator */}
            <motion.div variants={fadeUp} className="p-8 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:bg-white/80 hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                 <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Code Generator</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Expert full-stack engineer. Writes, reviews, and refactors production code.</p>
            </motion.div>

            {/* Email Architect */}
            <motion.div variants={fadeUp} className="p-8 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:bg-white/80 hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                 <Mail className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Architect</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Crafts high-converting B2B cold outreach sequences that get replies.</p>
            </motion.div>

            {/* Website Builder */}
            <motion.div variants={fadeUp} className="p-8 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:bg-white/80 hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                 <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Website Builder</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Spins up full landing pages, styles, and web architectures from zero.</p>
            </motion.div>

            {/* Deep Research */}
            <motion.div variants={fadeUp} className="p-8 bg-white/60 backdrop-blur-2xl border border-black/5 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] group hover:bg-white/80 hover:-translate-y-1 transition-all duration-500">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
                 <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Deep Research</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Navigates the web to compile massive reports with cited sources.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* FEATURES (POWER MENU) */}
        <section className="py-32 relative z-10 border-y border-black/5 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="space-y-8"
              >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                  <Command className="h-3 w-3" /> The Power Menu
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">Context is Everything.</motion.h2>
                <motion.p variants={fadeUp} className="text-xl text-zinc-500 leading-relaxed font-medium">
                  Don't just chat. Inject deep native context into your Agents using the command-line grade Power Menu.
                </motion.p>
                <motion.ul variants={staggerContainer} className="space-y-4">
                  <motion.li variants={fadeUp} className="flex items-center gap-4 bg-zinc-50 border border-black/5 p-4 rounded-2xl scale-100 hover:scale-[1.02] transition-transform">
                    <div className="p-2 bg-white border border-black/5 rounded-xl shadow-sm"><Github className="h-5 w-5 text-black" /></div>
                    <span className="font-bold text-lg">Native GitHub Syncs</span>
                  </motion.li>
                  <motion.li variants={fadeUp} className="flex items-center gap-4 bg-zinc-50 border border-black/5 p-4 rounded-2xl scale-100 hover:scale-[1.02] transition-transform">
                    <div className="p-2 bg-white border border-black/5 rounded-xl shadow-sm"><ImageIcon className="h-5 w-5 text-black" /></div>
                    <span className="font-bold text-lg">Realtime Image Generation</span>
                  </motion.li>
                  <motion.li variants={fadeUp} className="flex items-center gap-4 bg-zinc-50 border border-black/5 p-4 rounded-2xl scale-100 hover:scale-[1.02] transition-transform">
                    <div className="p-2 bg-white border border-black/5 rounded-xl shadow-sm"><FolderOpen className="h-5 w-5 text-black" /></div>
                    <span className="font-bold text-lg">Local File & Directory Support</span>
                  </motion.li>
                </motion.ul>
              </motion.div>

              {/* Visual Demo area */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center group"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-70 group-hover:bg-blue-200 transition-colors duration-1000" />
                 <div className="w-80 bg-white/80 backdrop-blur-2xl border border-black/5 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-4 relative z-10 transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-2">
                    <div className="space-y-2 mb-4">
                      <div className="p-4 bg-white rounded-xl flex items-center gap-3 border border-black/5 shadow-sm">
                         <Github className="h-5 w-5 text-zinc-400" /> <span className="text-sm font-bold flex-1 text-black">Import from GitHub</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl flex items-center gap-3 border border-black/5 shadow-sm">
                         <Layers className="h-5 w-5 text-zinc-400" /> <span className="text-sm font-bold flex-1 text-black">Create from Figma</span>
                      </div>
                      <div className="p-4 bg-white rounded-xl flex items-center justify-between gap-3 border border-black/5 shadow-sm">
                         <div className="flex items-center gap-3">
                           <ImageIcon className="h-5 w-5 text-zinc-400" /> <span className="text-sm font-bold flex-1 text-black">Generate Images</span>
                         </div>
                         <div className="w-8 h-4 rounded-full bg-green-500 relative"><div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" /></div>
                      </div>
                      <div className="p-4 bg-white rounded-xl flex items-center gap-3 border border-black/5 shadow-sm">
                         <Command className="h-5 w-5 text-zinc-400" /> <span className="text-sm font-bold flex-1 text-black">MCP Connections</span>
                      </div>
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USPs Grid */}
        <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12"
          >
            <motion.div variants={fadeUp} className="p-10 bg-white/60 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden relative group hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl group-hover:bg-green-200 transition-all duration-700" />
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                 <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-black mb-4 relative z-10 tracking-tight">Data Sovereignty.</h3>
              <p className="text-zinc-500 text-lg leading-relaxed relative z-10">
                We don't want your data. Connect your own AWS S3 bucket and securely retain 100% ownership of your IP and assets.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="p-10 bg-white/60 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden relative group hover:-translate-y-1 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl group-hover:bg-amber-200 transition-all duration-700" />
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                 <Globe className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-3xl font-black mb-4 relative z-10 tracking-tight">Pay Per Token.</h3>
              <p className="text-zinc-500 text-lg leading-relaxed relative z-10">
                Zero monthly subscriptions. OLLI-E tracks LLM token usage down to the exact decimal and deducts securely from your wallet in real time.
              </p>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Final CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="py-40 px-6 text-center relative z-10 border-t border-black/5 bg-white bg-gradient-to-b from-transparent to-zinc-50"
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-black">
            Ready to scale?
          </h2>
          <Link
            href="/dashboard"
            className="inline-flex px-10 py-5 bg-black text-white rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl items-center gap-3"
          >
            Enter Workspace <ChevronRight className="h-6 w-6" />
          </Link>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#fbfbfd] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-zinc-500 text-sm font-medium border-t border-black/5 pt-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white">
              <Sparkles className="h-3 w-3 fill-white" />
            </div>
            <span className="font-black text-black tracking-widest uppercase">OLLI-E</span>
            <span>© 2026 Advanced AI</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-black transition-colors">S3 Liability</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
