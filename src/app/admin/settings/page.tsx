"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Key, Database, CreditCard, Lock, Globe, Bot } from "lucide-react";

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

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={staggerContainer} 
      className="space-y-8"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">Platform Settings</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Configure core system variables and connected APIs.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-black hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/10 px-8 h-10 font-bold transition-all"
        >
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Core Identity */}
        <motion.div variants={fadeUp}>
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full">
            <CardHeader className="bg-zinc-50/50 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Globe className="h-5 w-5 text-blue-500" />
                Core Platform Identity
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">
                Public-facing platform details.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Platform Name</Label>
                <Input defaultValue="OLLI-E AI" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Support Email</Label>
                <Input defaultValue="support@olli-e.ai" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Aggregator */}
        <motion.div variants={fadeUp}>
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full">
             <CardHeader className="bg-emerald-50/30 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Bot className="h-5 w-5 text-emerald-500" />
                AI Aggregator (OpenRouter)
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">
                API connectivity for model execution.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">OpenRouter API Key</Label>
                <div className="relative">
                  <Input type="password" defaultValue="sk-or-v1-fb613a9..." className="bg-zinc-50 border-zinc-200 rounded-xl pr-10" />
                  <Key className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Authentication & DB */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
             <CardHeader className="bg-zinc-50/50 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Lock className="h-5 w-5 text-violet-500" />
                Infrastructure & Authentication
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">
                Clerk configuration and Neon DB connections.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600 flex items-center gap-2"><Database className="h-4 w-4" /> Neon Database URL</Label>
                  <Input type="password" defaultValue="postgres://user:pass@ep-restless..." className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Upstash Redis REST URL</Label>
                  <Input type="password" defaultValue="https://evident-porpoise..." className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Clerk Publishable Key</Label>
                  <Input defaultValue="pk_test_bWVldC1ndWxs..." className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Clerk Secret Key</Label>
                  <Input type="password" defaultValue="sk_test_..." className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Gateways */}
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
             <CardHeader className="bg-orange-50/30 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Payment Gateways
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">
                Wallet top-up providers and API secrets.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Razorpay Key ID</Label>
                <Input defaultValue="rzp_test_12345" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">PayPal Client ID</Label>
                <Input defaultValue="Af2D4-..." className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Zwitch API Key</Label>
                <Input type="password" defaultValue="zw_test_123" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Instamojo Auth Token</Label>
                <Input type="password" defaultValue="im_test_123" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
