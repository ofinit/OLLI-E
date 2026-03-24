"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Database, Lock, Check, ChevronRight } from "lucide-react";
import Link from "next/link";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ isOpen, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-zinc-100 rounded-3xl shadow-2xl p-8">
        <DialogHeader className="items-center text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center">
            <Lock className="h-8 w-8 text-zinc-900" />
          </div>
          <DialogTitle className="text-2xl font-black font-heading uppercase tracking-tight">Login Required</DialogTitle>
          <DialogDescription className="text-zinc-500 text-base font-medium">
            To securely upload and store your files on your own infrastructure, please sign in or create an account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-3 mt-6">
          <Link href="/sign-up" className="w-full">
            <Button className="w-full h-14 bg-black text-white hover:bg-zinc-800 rounded-2xl font-bold text-lg shadow-xl shadow-black/10">
              Create Free Account
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full h-12 text-zinc-400 hover:text-zinc-900 font-medium"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface S3ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PROVIDERS = [
  { id: "aws", name: "AWS S3", icon: Database, color: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", link: "https://aws.amazon.com/s3/" },
  { id: "r2", name: "Cloudflare R2", icon: ShieldAlert, color: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", link: "https://www.cloudflare.com/products/r2/" },
  { id: "backblaze", name: "Backblaze B2", icon: Database, color: "bg-red-50", text: "text-red-600", border: "border-red-100", link: "https://www.backblaze.com/b2/cloud-storage.html" },
  { id: "wasabi", name: "Wasabi", icon: Database, color: "bg-green-50", text: "text-green-600", border: "border-green-100", link: "https://wasabi.com/" },
  { id: "gcs", name: "Google Cloud", icon: Lock, color: "bg-green-50", text: "text-green-600", border: "border-green-100", link: "https://cloud.google.com/storage" },
  { id: "do", name: "DigitalOcean", icon: Database, color: "bg-sky-50", text: "text-sky-600", border: "border-sky-100", link: "https://www.digitalocean.com/products/spaces" },
  { id: "other", name: "Other S3", icon: Database, color: "bg-zinc-50", text: "text-zinc-600", border: "border-zinc-100", link: "#" },
];

export function S3ConfigModal({ isOpen, onOpenChange, onSuccess }: S3ModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("aws");

  const [bucketName, setBucketName] = useState("");
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [region, setRegion] = useState(""); // Endpoint / Region

  const provider = PROVIDERS.find(p => p.id === selectedProvider) || PROVIDERS[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/s3-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bucketName,
          accessKeyId,
          secretAccessKey,
          region,
          provider: selectedProvider
        })
      });

      if (!response.ok) throw new Error('Failed to save config');

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
        onSuccess();
      }, 1500);
    } catch (err) {
      alert("Error saving S3 configuration. Please check your keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white border-zinc-100 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden relative">
        {success && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-black/20">
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
            <p className="text-xl font-black font-heading uppercase tracking-tighter">Connection Verified</p>
          </div>
        )}

        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center`}>
              <provider.icon className={`h-6 w-6 ${provider.text}`} />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-2xl font-black font-heading uppercase tracking-tight leading-none">Connect Storage</DialogTitle>
              <DialogDescription className="text-zinc-400 font-medium">Choose your storage provider to store your files privately.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Provider Selection Scrollable Area */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-100">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProvider(p.id)}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 group whitespace-nowrap overflow-hidden ${
                selectedProvider === p.id 
                  ? "bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-black/10" 
                  : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <p className={`text-[8px] uppercase font-black tracking-widest ${selectedProvider === p.id ? "text-white/50" : "text-zinc-400"}`}>
                Provider
              </p>
              <p className="font-bold text-[11px] truncate">{p.name}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-6 mt-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Bucket Name</label>
                <a href={provider.link} target="_blank" className="text-[10px] font-bold text-zinc-900 underline underline-offset-2 flex items-center gap-1 group text-right">
                  Setup Guide
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
              <Input 
                required 
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                placeholder="e.g. my-private-files" 
                className="h-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-medium text-lg px-6"
              />
            </div>

            {/* Provider-Specific Fields */}
            {selectedProvider === "r2" && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Cloudflare Account ID</label>
                <div className="relative">
                  <Input 
                    required 
                    placeholder="Paste 32-character ID" 
                    className="h-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-mono px-6"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-400 italic">Found on R2 dashboard</div>
                </div>
              </div>
            )}

            {(selectedProvider === "backblaze" || selectedProvider === "wasabi" || selectedProvider === "other" || selectedProvider === "do") && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Endpoint URL</label>
                <Input 
                  required 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder={`e.g. ${selectedProvider}.s3.amazonaws.com or custom ip`} 
                  className="h-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-mono px-6"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                  {selectedProvider === "backblaze" ? "Key ID" : "Access Key"}
                </label>
                <Input 
                  required 
                  type="password"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  placeholder="Paste Access Key" 
                  className="h-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-mono px-6"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                  {selectedProvider === "backblaze" ? "Application Key" : "Secret Key"}
                </label>
                <Input 
                  required 
                  type="password"
                  value={secretAccessKey}
                  onChange={(e) => setSecretAccessKey(e.target.value)}
                  placeholder="Paste Secret Key" 
                  className="h-14 bg-zinc-50/50 border-zinc-100 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black transition-all font-mono px-6"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-6 flex gap-4 border border-zinc-100 text-left">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-zinc-100">
              <ShieldAlert className="h-4 w-4 text-zinc-400" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-900">Quick Start Guide</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Think of the <span className="font-bold text-zinc-900">Bucket</span> as your private folder and the <span className="font-bold text-zinc-900">Keys</span> as your digital locks. 
                Keep them secret—they give OLLI-E permission to store your files in your own vault. 
                <a href={provider.link} target="_blank" className="font-bold text-zinc-900 hover:underline inline ml-1">Learn more about {provider.name}.</a>
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-18 bg-black text-white hover:bg-zinc-800 rounded-3xl font-black text-xl shadow-2xl shadow-black/10 transition-all active:scale-[0.98] py-8"
            >
              {loading ? "Verifying Keys..." : "Save Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
