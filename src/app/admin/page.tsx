"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Users", value: "128", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Revenue This Month", value: "$342.50", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "API Calls Today", value: "1,294", icon: Activity, color: "text-violet-500", bg: "bg-violet-50" },
  { label: "Avg. Profit Margin", value: "52%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function AdminDashboardPage() {
  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer} 
      className="space-y-8"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-4xl font-black tracking-tighter text-black">Dashboard</h1>
        <p className="text-zinc-500 mt-2 text-lg font-medium">Real-time overview of OLLI-E platform activity.</p>
      </motion.div>
      
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card className="bg-white/60 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-colors duration-500 border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-zinc-500 tracking-tight">{stat.label}</CardTitle>
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                   <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-black tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp}>
        <Card className="bg-white/60 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none overflow-hidden">
          <CardHeader className="bg-white/40 border-b border-black/5">
            <CardTitle className="text-black font-bold text-xl tracking-tight">Recent API Usage</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-zinc-400 text-left bg-zinc-50/50">
                    <th className="py-4 pl-6 pr-4 font-semibold">User</th>
                    <th className="py-4 pr-4 font-semibold">Niche Tool</th>
                    <th className="py-4 pr-4 font-semibold">Tokens Used</th>
                    <th className="py-4 pr-4 font-semibold">Cost Deducted</th>
                    <th className="py-4 pr-6 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {[
                    { user: "user@example.com", tool: "Website Builder", tokens: "1,240", cost: "$0.0031", time: "2m ago" },
                    { user: "demo@test.com", tool: "Content Writer", tokens: "890", cost: "$0.0018", time: "15m ago" },
                    { user: "abc@mail.com", tool: "Code Generator", tokens: "3,100", cost: "$0.0093", time: "1h ago" },
                  ].map((row, i) => (
                    <tr key={i} className="text-zinc-600 hover:bg-black/[0.02] py-2 transition-colors duration-200">
                      <td className="py-4 pl-6 pr-4 font-medium text-black">{row.user}</td>
                      <td className="py-4 pr-4">
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold border border-violet-200 shadow-sm">
                          {row.tool}
                        </span>
                      </td>
                      <td className="py-4 pr-4 font-medium">{row.tokens}</td>
                      <td className="py-4 pr-4 text-emerald-600 font-mono font-bold tracking-tight">{row.cost}</td>
                      <td className="py-4 pr-6 text-zinc-400 font-medium">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
