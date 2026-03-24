"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Database, CreditCard, Lock, Globe, Bot } from "lucide-react";
import { saveSettings } from "./actions";

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

export function SettingsForm({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    platformName: initialData?.platformName || "",
    supportEmail: initialData?.supportEmail || "",
    openRouterApiKey: initialData?.openRouterApiKey || "",
    neonDbUrl: initialData?.neonDbUrl || "",
    upstashRedisUrl: initialData?.upstashRedisUrl || "",
    clerkPublishableKey: initialData?.clerkPublishableKey || "",
    clerkSecretKey: initialData?.clerkSecretKey || "",
    razorpayKeyId: initialData?.razorpayKeyId || "",
    paypalClientId: initialData?.paypalClientId || "",
    zwitchApiKey: initialData?.zwitchApiKey || "",
    instamojoAuthToken: initialData?.instamojoAuthToken || "",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await saveSettings(formData);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">Platform Settings</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Configure core system variables and connected APIs.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-black hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/10 px-8 h-10 font-bold transition-all">
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={fadeUp}>
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full">
            <CardHeader className="bg-zinc-50/50 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Globe className="h-5 w-5 text-blue-500" />
                Core Platform Identity
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Public-facing platform details.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Platform Name</Label>
                <Input value={formData.platformName} onChange={(e) => setFormData({...formData, platformName: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Support Email</Label>
                <Input value={formData.supportEmail} onChange={(e) => setFormData({...formData, supportEmail: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full">
             <CardHeader className="bg-emerald-50/30 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Bot className="h-5 w-5 text-emerald-500" />
                AI Aggregator (OpenRouter)
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">API connectivity for model execution.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="font-bold text-zinc-600">OpenRouter API Key</Label>
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase font-black tracking-widest text-emerald-600 hover:text-emerald-700 hover:underline transition-all">Get keys ↗</a>
                </div>
                <div className="relative">
                  <Input type="password" value={formData.openRouterApiKey} onChange={(e) => setFormData({...formData, openRouterApiKey: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl pr-10" />
                  <Key className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
             <CardHeader className="bg-zinc-50/50 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <Lock className="h-5 w-5 text-violet-500" />
                Infrastructure & Authentication
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Clerk configuration and Neon DB connections.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600 flex items-center gap-2"><Database className="h-4 w-4" /> Neon Database URL</Label>
                  <Input type="password" value={formData.neonDbUrl} onChange={(e) => setFormData({...formData, neonDbUrl: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Upstash Redis REST URL</Label>
                  <Input type="password" value={formData.upstashRedisUrl} onChange={(e) => setFormData({...formData, upstashRedisUrl: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Clerk Publishable Key</Label>
                  <Input value={formData.clerkPublishableKey} onChange={(e) => setFormData({...formData, clerkPublishableKey: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Clerk Secret Key</Label>
                  <Input type="password" value={formData.clerkSecretKey} onChange={(e) => setFormData({...formData, clerkSecretKey: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
             <CardHeader className="bg-orange-50/30 border-b border-black/5 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-black text-black">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Payment Gateways
              </CardTitle>
              <CardDescription className="text-zinc-500 font-medium">Wallet top-up providers and API secrets.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Razorpay Key ID</Label>
                <Input value={formData.razorpayKeyId} onChange={(e) => setFormData({...formData, razorpayKeyId: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">PayPal Client ID</Label>
                <Input value={formData.paypalClientId} onChange={(e) => setFormData({...formData, paypalClientId: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Zwitch API Key</Label>
                <Input type="password" value={formData.zwitchApiKey} onChange={(e) => setFormData({...formData, zwitchApiKey: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Instamojo Auth Token</Label>
                <Input type="password" value={formData.instamojoAuthToken} onChange={(e) => setFormData({...formData, instamojoAuthToken: e.target.value})} className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </motion.div>
  );
}
