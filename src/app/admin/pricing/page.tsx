"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, TrendingUp, Gift, Building2, Zap, Save } from "lucide-react";

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
    transition: { staggerChildren: 0.1 }
  }
};

export default function PricingPage() {
  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer} 
      className="space-y-8"
    >
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">Pricing & Margins</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Control global pricing architecture, wholesale discounts, and deposit bonuses.</p>
        </div>
        <Button className="bg-black hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/10 px-8 h-10 font-bold transition-all gap-2">
          <Save className="w-4 h-4" /> Save Pricing Rules
        </Button>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Blended Margin
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">48.2%</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" /> Daily Revenue
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">$142.50</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" /> Active B2B Tiers
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">14 acts</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <Gift className="w-4 h-4 text-violet-500" /> Total Bonuses Given
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">$2,840</p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Global Strategy */}
        <motion.div variants={fadeUp}>
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full overflow-hidden">
             <CardHeader className="bg-blue-50/30 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Percent className="h-5 w-5 text-blue-500" />
                Global Base Strategy
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">
                Baseline multipliers applied to all new users unconditionally.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 pb-6">
                <div className="space-y-1 w-2/3">
                  <Label className="font-bold text-black text-base">Standard Global Markup</Label>
                  <p className="text-sm text-zinc-500">The default markup percentage added to raw token costs (OpenRouter API cost).</p>
                </div>
                <div className="w-1/3 flex justify-end">
                  <div className="relative w-24">
                    <Input type="number" defaultValue="40" className="bg-zinc-50 border-zinc-200 rounded-xl font-bold pr-8 text-right text-lg" />
                    <Percent className="absolute right-3 top-3 h-4 w-4 text-zinc-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1 w-[280px]">
                  <div className="flex items-center gap-2">
                    <Label className="font-bold text-black text-base">Smart Rounding</Label>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-1.5 shadow-none font-bold text-[10px]">RECOMMENDED</Badge>
                  </div>
                  <p className="text-sm text-zinc-500">Automatically round final user prices to clean numbers (e.g. $0.05 instead of $0.048).</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* B2B Wholesale Tiers */}
        <motion.div variants={fadeUp}>
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full overflow-hidden">
             <CardHeader className="bg-emerald-50/30 border-b border-black/5 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  B2B Wholesale Subscriptions
                </CardTitle>
                <Switch defaultChecked />
              </div>
              <CardDescription className="text-zinc-500 font-medium mt-1.5">
                Automatically discount rates for high-volume enterprise wallets.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-bold text-black">Qualification Threshold</Label>
                  <p className="text-sm text-zinc-500">Minimum wallet balance to trigger wholesale pricing.</p>
                </div>
                <div className="relative w-32">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input type="number" defaultValue="1000" className="bg-zinc-50 border-zinc-200 rounded-xl font-bold pl-8 text-black" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div className="space-y-1">
                  <Label className="font-bold text-black">Discount Rate (vs Global Markup)</Label>
                  <p className="text-sm text-zinc-500">How much to reduce the profit margin for qualified B2B accounts.</p>
                </div>
                <div className="relative w-28">
                  <Input type="number" defaultValue="-15" className="bg-zinc-50 border-zinc-200 rounded-xl font-bold text-emerald-600 text-right pr-8" />
                  <Percent className="absolute right-3 top-3 h-4 w-4 text-emerald-600/50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deposit Bonuses */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
             <CardHeader className="bg-violet-50/30 border-b border-black/5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                    <Zap className="h-5 w-5 text-violet-500 flex-shrink-0" />
                    Fiat Deposit Incentives (Top-Up Bonuses)
                  </CardTitle>
                  <CardDescription className="text-zinc-500 font-medium mt-1">
                    Encourage larger upfront commitments by granting bonus wallet credits for larger fiat deposits.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50/50 text-zinc-500 border-b border-black/5">
                  <tr>
                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-xs">When User Deposits</th>
                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-xs text-center">Bonus Type</th>
                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-xs text-right">Added Value</th>
                    <th className="px-6 py-3 font-bold uppercase tracking-widest text-xs text-right">They Receive</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                   <tr className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-black font-bold text-lg">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        50.00
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 shadow-none font-bold border-none px-2.5">Fixed Amount</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 text-violet-600 font-bold text-lg">
                        + <DollarSign className="w-4 h-4" /> 5.00
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-right text-black text-lg">
                      $55.00
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-50/50 transition-colors bg-zinc-50/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-black font-bold text-lg">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        100.00
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 shadow-none font-bold border-none px-2.5">Percentage</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 text-violet-600 font-bold text-lg">
                        + 15%
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-right text-black text-lg">
                      $115.00
                    </td>
                  </tr>
                   <tr className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-black font-bold text-lg">
                        <DollarSign className="w-4 h-4 text-zinc-400" />
                        500.00
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 shadow-none font-bold border-none px-2.5">Percentage</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 text-violet-600 font-bold text-lg">
                        + 25%
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-right text-black text-lg flex gap-2 items-center justify-end">
                      $625.00 <Badge className="bg-black text-white hover:bg-black uppercase tracking-widest text-[10px] px-1.5 ml-2">Best</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 border-t border-black/5 bg-zinc-50">
                <Button variant="outline" className="w-full border-dashed border-2 border-zinc-200 text-zinc-600 hover:bg-white hover:text-black rounded-xl font-bold bg-transparent">
                  + Add New Bonus Tier
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
