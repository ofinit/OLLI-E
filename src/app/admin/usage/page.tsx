"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollText, Search, Download, ArrowUpRight, Activity, Ban } from "lucide-react";

// Mock Data for Usage Logs
const mockLogs = [
  { id: "log_9f82a1c", user: "sarah.j@acme.inc", niche: "Agent Swarm", tokensIn: 4820, tokensOut: 1205, cost: 0.048, status: "Success", time: "Just now" },
  { id: "log_4t11x9p", user: "dev@tech-forge.co", niche: "Website Builder", tokensIn: 1100, tokensOut: 3240, cost: 0.052, status: "Success", time: "2 min ago" },
  { id: "log_2m98q0w", user: "mike.chen@solo.io", niche: "Deep Research", tokensIn: 18000, tokensOut: 800, cost: 0.125, status: "Success", time: "5 min ago" },
  { id: "log_7v66n5b", user: "hello@creative.studio", niche: "Social Media Guru", tokensIn: 400, tokensOut: 0, cost: 0.000, status: "Rate Limited", time: "12 min ago" },
  { id: "log_1k33z8x", user: "alex@venture.capital", niche: "Financial Analyst", tokensIn: 2500, tokensOut: 950, cost: 0.045, status: "Success", time: "18 min ago" },
  { id: "log_p988v2c", user: "sarah.j@acme.inc", niche: "Expert Developer", tokensIn: 880, tokensOut: 1120, cost: 0.024, status: "Failed", time: "22 min ago" },
  { id: "log_w442n0m", user: "design@agency.co", niche: "Website Builder", tokensIn: 540, tokensOut: 2100, cost: 0.031, status: "Success", time: "1 hr ago" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

export default function UsagePage() {
  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer} 
      className="space-y-8"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">Usage Logs</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Real-time ledger of all platform API interactions and token events.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input 
              placeholder="Search by User or Log ID..." 
              className="bg-white border-zinc-200 rounded-xl pr-10 w-full md:w-64 focus-visible:ring-black/10"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
          </div>
          <Button variant="outline" className="bg-white border-zinc-200 text-black hover:bg-zinc-50 rounded-xl shadow-sm h-10 font-bold px-4">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs">Total API Calls</p>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-4xl font-black text-black mt-2 tracking-tighter">14,208</p>
            <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded-md">+12.5% this week</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs">Total Tokens Processed</p>
              <ScrollText className="h-4 w-4 text-violet-500" />
            </div>
            <p className="text-4xl font-black text-black mt-2 tracking-tighter">1.8M <span className="text-xl text-zinc-400 font-medium">tokens</span></p>
            <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded-md">+4.2% this week</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs">Gross Revenue / Wallet Deductions</p>
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-4xl font-black text-black mt-2 tracking-tighter">$482.50</p>
            <p className="text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded-md">+8.1% this week</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Table */}
      <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50/80 text-zinc-900 border-b border-black/5">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">Log Reference</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">User</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">Niche Used</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap text-right">Tokens (In/Out)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap text-right">Wallet Cost</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {mockLogs.map((log, i) => (
                <motion.tr 
                  variants={fadeUp} 
                  key={log.id} 
                  className={`border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/20'}`}
                >
                  <td className="px-6 py-4 font-mono text-xs text-zinc-500 font-medium">
                    {log.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-black">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium whitespace-nowrap">
                    {log.niche}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono text-zinc-900 font-bold">{log.tokensIn.toLocaleString()} <span className="text-zinc-400 font-normal">in</span></div>
                    <div className="font-mono text-zinc-500 font-medium text-xs mt-0.5">{log.tokensOut.toLocaleString()} <span className="font-normal text-zinc-400">out</span></div>
                  </td>
                  <td className="px-6 py-4 font-mono font-black text-emerald-600 text-right">
                    ${log.cost.toFixed(3)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      className={`shadow-none font-bold border-none px-2.5 py-0.5 ${
                        log.status === "Success" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" :
                        log.status === "Rate Limited" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
                        "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {log.status === "Rate Limited" && <Ban className="w-3 h-3 mr-1 inline" />}
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-500 font-medium whitespace-nowrap">
                    {log.time}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
