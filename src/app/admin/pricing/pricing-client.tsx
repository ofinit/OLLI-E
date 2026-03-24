"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Percent, TrendingUp, Gift, Building2, Zap, Save, Trash } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { savePricingSettings, addDepositBonus, removeDepositBonus } from "./actions";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function PricingClient({ initialSettings, initialBonuses }: { initialSettings: any, initialBonuses: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    globalMarkup: initialSettings?.globalMarkup || 40,
    smartRounding: initialSettings?.smartRounding ?? true,
    wholesaleEnabled: initialSettings?.wholesaleEnabled ?? true,
    wholesaleThreshold: initialSettings?.wholesaleThreshold || "1000",
    wholesaleDiscountRate: initialSettings?.wholesaleDiscountRate || 15,
  });

  const [newBonus, setNewBonus] = useState({
    depositAmount: "100",
    bonusType: "percentage",
    bonusValue: "10",
    isBestValue: false,
  });

  const handleSave = () => {
    startTransition(() => {
      savePricingSettings({
        globalMarkup: Number(formData.globalMarkup),
        smartRounding: formData.smartRounding,
        wholesaleEnabled: formData.wholesaleEnabled,
        wholesaleThreshold: formData.wholesaleThreshold,
        wholesaleDiscountRate: Number(formData.wholesaleDiscountRate),
      });
    });
  };

  const handleAddBonus = () => {
    startTransition(() => {
      addDepositBonus(newBonus).then(() => {
        setNewBonus({
          depositAmount: "100",
          bonusType: "percentage",
          bonusValue: "10",
          isBestValue: false,
        });
      });
    });
  };

  const handleRemoveBonus = (id: string) => {
    startTransition(() => {
      removeDepositBonus(id);
    });
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const handleSyncPrices = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/sync-prices", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Prices synced successfully!");
        window.location.reload();
      } else {
        alert("Failed to sync prices: " + data.error);
      }
    } catch (err) {
      alert("Error syncing prices.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">Pricing & Margins</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Control global pricing architecture, wholesale discounts, and deposit bonuses.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleSyncPrices} 
            disabled={isSyncing} 
            variant="outline"
            className="border-2 border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl px-6 h-10 font-bold transition-all gap-2"
          >
            <Zap className={`w-4 h-4 text-amber-500 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Live Prices"}
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="bg-black hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/10 px-8 h-10 font-bold transition-all gap-2">
            <Save className="w-4 h-4" /> {isPending ? "Saving..." : "Save Pricing Rules"}
          </Button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Blended Margin
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">{formData.globalMarkup}%</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" /> Daily Revenue
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">$0.00</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-500" /> Active B2B Tiers
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">0 acts</p>
          </CardContent>
        </Card>
        <Card className="bg-white/60 backdrop-blur-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-5">
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs flex items-center gap-2">
              <Gift className="w-4 h-4 text-violet-500" /> Total Bonuses Given
            </p>
            <p className="text-3xl font-black text-black mt-2 tracking-tighter">$0</p>
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
                    <Input 
                      type="number" 
                      value={formData.globalMarkup} 
                      onChange={e => setFormData({...formData, globalMarkup: Number(e.target.value)})}
                      className="bg-zinc-50 border-zinc-200 rounded-xl font-bold pr-8 text-right text-lg" 
                    />
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
                <Switch 
                  checked={formData.smartRounding} 
                  onCheckedChange={c => setFormData({...formData, smartRounding: c})} 
                />
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
                <Switch 
                  checked={formData.wholesaleEnabled}
                  onCheckedChange={c => setFormData({...formData, wholesaleEnabled: c})} 
                />
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
                  <Input 
                    type="number" 
                    value={formData.wholesaleThreshold} 
                    onChange={e => setFormData({...formData, wholesaleThreshold: e.target.value})}
                    className="bg-zinc-50 border-zinc-200 rounded-xl font-bold pl-8 text-black" 
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div className="space-y-1">
                  <Label className="font-bold text-black">Discount Rate (vs Global Markup)</Label>
                  <p className="text-sm text-zinc-500">How much to reduce the profit margin for qualified accounts.</p>
                </div>
                <div className="relative w-28">
                  <Input 
                    type="number" 
                    value={formData.wholesaleDiscountRate} 
                    onChange={e => setFormData({...formData, wholesaleDiscountRate: Number(e.target.value)})}
                    className="bg-zinc-50 border-zinc-200 rounded-xl font-bold text-emerald-600 text-right pr-8" 
                  />
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
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {initialBonuses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-medium">No bonuses configured. Add one below.</td>
                    </tr>
                  ) : initialBonuses.map((bonus, i) => {
                    const deposit = parseFloat(bonus.depositAmount);
                    const val = parseFloat(bonus.bonusValue);
                    const total = bonus.bonusType === "fixed" ? deposit + val : deposit * (1 + val / 100);
                    return (
                      <tr key={bonus.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-black font-bold text-lg">
                            <DollarSign className="w-4 h-4 text-zinc-400" />
                            {deposit.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="secondary" className="shadow-none font-bold border-none px-2.5 bg-blue-100 text-blue-700">
                            {bonus.bonusType === "percentage" ? "Percentage" : "Fixed Amount"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 text-violet-600 font-bold text-lg">
                            + {bonus.bonusType === "fixed" ? `$${val.toFixed(2)}` : `${val}%`}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono font-black text-right text-black text-lg flex gap-2 items-center justify-end">
                          ${total.toFixed(2)} {bonus.isBestValue && <Badge className="bg-black text-white hover:bg-black uppercase tracking-widest text-[10px] px-1.5 ml-2">Best</Badge>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button size="icon" variant="ghost" onClick={() => handleRemoveBonus(bonus.id)} className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50" title="Delete">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-4 border-t border-black/5 bg-zinc-50 flex items-center justify-between gap-4">
                 <div className="flex gap-4 items-center flex-1">
                  <Input type="number" value={newBonus.depositAmount} onChange={e => setNewBonus({...newBonus, depositAmount: e.target.value})} placeholder="Deposit Amount" className="w-32 bg-white" />
                  <select value={newBonus.bonusType} onChange={e => setNewBonus({...newBonus, bonusType: e.target.value})} className="bg-white border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <Input type="number" value={newBonus.bonusValue} onChange={e => setNewBonus({...newBonus, bonusValue: e.target.value})} placeholder="Value" className="w-24 bg-white" />
                  <label className="flex items-center gap-2 text-sm font-bold text-zinc-600 cursor-pointer pl-4">
                     <input type="checkbox" checked={newBonus.isBestValue} onChange={e => setNewBonus({...newBonus, isBestValue: e.target.checked})} className="rounded text-black focus:ring-black" />
                     Is Best Value?
                  </label>
                 </div>
                 <Button onClick={handleAddBonus} disabled={isPending} variant="outline" className="border-dashed border-2 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-black rounded-xl font-bold bg-transparent px-8">
                   + Add
                 </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
