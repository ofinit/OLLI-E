"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Power, BrainCircuit, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { addModelAction, updateModelAction, toggleModelStatusAction } from "./actions";

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

const formatSyncDate = (iso?: string) => {
  if (!iso) return "Needs Sync";
  const d = new Date(iso);
  return `Updated ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export function ModelsClient({ initialModels }: { initialModels: any[] }) {
  const [models, setModels] = useState(initialModels);
  const [editingModel, setEditingModel] = useState<any | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [newModel, setNewModel] = useState({
    nicheName: "",
    providerModelId: "",
    systemPrompt: "",
    profitMarginPercent: 50,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);

  const syncPrices = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/sync-prices");
      const data = await res.json();
      if (data.success && data.models) {
        setModels(data.models);
      }
    } catch (err) {
      console.error("Failed to sync prices", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleStatus = (id: string, currentStatus: boolean) => {
    // optimistic update
    setModels(models.map(m => m.id === id ? { ...m, isActive: !currentStatus } : m));
    startTransition(() => {
      toggleModelStatusAction(id, currentStatus);
    });
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;
    setModels(models.map(m => m.id === editingModel.id ? editingModel : m));
    
    startTransition(() => {
      updateModelAction(editingModel.id, editingModel);
    });
    setEditingModel(null);
  };

  const handleAddField = (e: any) => {
     setNewModel({...newModel, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      addModelAction(newModel).then(() => {
         setIsAddOpen(false);
         setNewModel({ nicheName: "", providerModelId: "", systemPrompt: "", profitMarginPercent: 50 });
      });
    });
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">AI Models & Niches</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Configure niche tools. Users will never see model names.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={syncPrices} disabled={isSyncing} variant="outline" className="bg-white border-zinc-200 text-black hover:bg-zinc-50 rounded-xl shadow-sm h-10 font-bold px-4 transition-all">
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? "Syncing..." : "Sync OpenRouter Prices"}
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger
            render={
              <div onClick={() => setIsAddOpen(true)} className="inline-flex items-center justify-center font-bold whitespace-nowrap bg-black hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-black/10 gap-2 px-6 h-10 text-sm cursor-pointer transition-colors">
                <Plus className="h-4 w-4" /> Add Niche Tool
              </div>
            }
          />
          <DialogContent className="bg-white border-black/5 text-zinc-900 max-w-lg rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">Add New Niche Tool</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 mt-2" onSubmit={handleAddSubmit}>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Niche Name (shown to users)</Label>
                <Input name="nicheName" value={newModel.nicheName} onChange={handleAddField} required placeholder="e.g. Website Builder" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Provider Model ID (hidden from users)</Label>
                <Input name="providerModelId" value={newModel.providerModelId} onChange={handleAddField} required placeholder="e.g. moonshotai/moonshot-v1-auto" className="bg-zinc-50 border-zinc-200 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Identity System Prompt</Label>
                <textarea 
                  name="systemPrompt" value={newModel.systemPrompt} onChange={handleAddField} required
                  rows={4}
                  placeholder="You are an exclusive OLLI-E tool. NEVER disclose the underlying AI model name..."
                  className="w-full rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-sm text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Base Cost / 1k tokens ($)</Label>
                  <Input type="number" disabled placeholder="0.00" className="bg-zinc-100 border-zinc-200 rounded-xl text-zinc-400 font-mono" />
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Synced from Provider API</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Profit Margin (%)</Label>
                  <Input name="profitMarginPercent" value={newModel.profitMarginPercent} onChange={handleAddField} type="number" required placeholder="50" className="bg-zinc-50 border-zinc-200 rounded-xl" />
                </div>
              </div>
              <Button disabled={isPending} type="submit" className="w-full bg-black hover:bg-zinc-800 text-white rounded-xl font-bold py-6 mt-4">
                {isPending ? "Saving..." : "Save Niche Tool"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <Dialog open={!!editingModel} onOpenChange={(open) => !open && setEditingModel(null)}>
        <DialogContent className="bg-white border-black/5 text-zinc-900 max-w-lg rounded-3xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Edit Niche Tool</DialogTitle>
          </DialogHeader>
          {editingModel && (
            <form className="space-y-4 mt-2" onSubmit={saveEdit}>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Niche Name (shown to users)</Label>
                <Input 
                  value={editingModel.nicheName} 
                  onChange={e => setEditingModel({...editingModel, nicheName: e.target.value})}
                  className="bg-zinc-50 border-zinc-200 rounded-xl" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Provider Model ID (hidden from users)</Label>
                <Input 
                  value={editingModel.providerModelId} 
                  onChange={e => setEditingModel({...editingModel, providerModelId: e.target.value})}
                  className="bg-zinc-50 border-zinc-200 rounded-xl" 
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-zinc-600">Identity System Prompt</Label>
                <textarea 
                  rows={4}
                  value={editingModel.systemPrompt}
                  onChange={e => setEditingModel({...editingModel, systemPrompt: e.target.value})}
                  className="w-full rounded-xl bg-zinc-50 border border-zinc-200 p-3 text-sm text-zinc-900 resize-none focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Base Cost / 1k tokens ($)</Label>
                  <Input 
                    type="number" 
                    disabled 
                    value={editingModel.baseCostPer1k}
                    className="bg-zinc-100 border-zinc-200 rounded-xl text-zinc-500 font-mono font-bold" 
                  />
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Synced via OpenRouter API</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-zinc-600">Profit Margin (%)</Label>
                  <Input 
                    type="number" 
                    value={editingModel.profitMarginPercent}
                    onChange={e => setEditingModel({...editingModel, profitMarginPercent: Number(e.target.value)})}
                    className="bg-zinc-50 border-zinc-200 rounded-xl" 
                  />
                </div>
              </div>
              <Button disabled={isPending} type="submit" className="w-full bg-black hover:bg-zinc-800 text-white rounded-xl font-bold py-6 mt-4">
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {initialModels.map((model) => {
          // Use the optimistic models array for display state if available
          const displayModel = models.find(m => m.id === model.id) || model;
          const baseCost = parseFloat((displayModel.baseCostPer1k).toString());
          const effectiveCost = (baseCost * (1 + displayModel.profitMarginPercent / 100)).toFixed(4);
          
          return (
            <motion.div key={displayModel.id} variants={fadeUp}>
              <Card className={`bg-white/60 backdrop-blur-2xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/80 transition-all duration-500 overflow-hidden ${!displayModel.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl shadow-sm border ${displayModel.isActive ? 'bg-emerald-50 border-emerald-100/50' : 'bg-zinc-100 border-zinc-200'}`}>
                        <BrainCircuit className={`h-6 w-6 ${displayModel.isActive ? 'text-emerald-600' : 'text-zinc-500'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-xl text-black tracking-tight">{displayModel.nicheName}</h3>
                          <Badge variant={displayModel.isActive ? "default" : "secondary"} className={displayModel.isActive ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 shadow-sm font-bold" : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 border-none font-bold"}>
                            {displayModel.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 mt-1">Model: <span className="text-zinc-600 font-mono tracking-tight">{displayModel.providerModelId}</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 text-sm shrink-0 bg-zinc-50/50 rounded-2xl py-3 px-6 border border-black/5">
                      <div className="text-right flex flex-col justify-center">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Base Cost / 1k</p>
                        <p className="font-mono text-zinc-900 font-medium">${baseCost.toFixed(4)}</p>
                        <p className="text-[10px] text-zinc-400/80 mt-1 font-medium tracking-tight whitespace-nowrap">{formatSyncDate((displayModel as any).updatedAt || (displayModel as any).createdAt)}</p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Profit Margin</p>
                        <p className="font-mono text-violet-600 font-bold">+{displayModel.profitMarginPercent}%</p>
                      </div>
                      <div className="text-right pr-4 border-r border-black/5 flex flex-col justify-center">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">User Price / 1k</p>
                        <p className="font-mono text-emerald-600 font-black">${effectiveCost}</p>
                      </div>
                      <div className="flex gap-1 pl-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => setEditingModel(displayModel)}
                          className="h-10 w-10 text-zinc-400 hover:text-black hover:bg-zinc-200/50 rounded-xl transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => toggleStatus(displayModel.id, displayModel.isActive)}
                          className={`h-10 w-10 rounded-xl transition-colors ${displayModel.isActive ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'}`}
                          title={displayModel.isActive ? 'Disable Tool' : 'Enable Tool'}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={fadeUp}>
        <Card className="bg-blue-50/50 border border-blue-100/50 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
               <BrainCircuit className="h-4 w-4" />
               Price Auto-Sync Enabled
            </CardTitle>
            <CardDescription className="text-blue-800/70 font-medium mt-2 text-sm leading-relaxed max-w-3xl">
              When you update the base cost for any model, the customer-facing price automatically recalculates to preserve your exact profit margin. No manual work required.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
}
