"use client";

import { useState } from "react";
import { 
  Instagram, Twitter, Linkedin, Youtube, 
  ChevronRight, Lock, Database, Globe, 
  Check, AlertCircle, Plus, Slack, 
  Mail, MessageSquare, Terminal, 
  Briefcase, Boxes, Layout, Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState("apps");

  const socialIntegrations = [
    { id: "instagram", name: "Instagram Business", icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", description: "Schedule posts & auto-reply to comments.", connected: true },
    { id: "x", name: "X / Twitter", icon: Twitter, color: "text-zinc-900", bg: "bg-zinc-100", description: "Post threads and track engagement.", connected: false },
    { id: "linkedin", name: "LinkedIn Pro", icon: Linkedin, color: "text-blue-700", bg: "bg-blue-50", description: "Professional networking and company posts.", connected: false },
    { id: "youtube", name: "YouTube Creator", icon: Youtube, color: "text-red-600", bg: "bg-red-50", description: "Publish shorts and manage video scripts.", connected: true },
  ];

  const appIntegrations = [
    { id: "slack", name: "Slack Connect", icon: Slack, color: "text-[#4A154B]", bg: "bg-purple-50", description: "Send alerts and read team messages across channels.", connected: true },
    { id: "gmail", name: "Google Gmail", icon: Mail, color: "text-red-500", bg: "bg-red-50/50", description: "Draft outreaches and manage your priority inbox.", connected: false },
    { id: "notion", name: "Notion Knowledge", icon: Layout, color: "text-zinc-900", bg: "bg-zinc-100", description: "Read project docs and update workspace pages.", connected: true },
    { id: "jira", name: "Jira / Linear", icon: Layers, color: "text-blue-600", bg: "bg-blue-50", description: "Track engineering tasks and project status.", connected: false },
    { id: "salesforce", name: "Salesforce CRM", icon: Briefcase, color: "text-sky-500", bg: "bg-sky-50", description: "Sync customer data and deal pipeline updates.", connected: false },
  ];

  const mcpServers = [
    { id: "mcp-files", name: "Local File System", source: "FileSystem MCP", status: "Active" },
    { id: "mcp-db", name: "Database Inspector", source: "SQL Server MCP", status: "Enabled" },
    { id: "mcp-custom", name: "Custom Toolset", source: "HTTP Endpoint", status: "Configuring" },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black font-heading uppercase tracking-tighter mb-4">Integration Hub</h1>
        <p className="text-zinc-500 font-medium max-w-2xl text-lg leading-snug">
          OLLI-E agents use **Model Context Protocol (MCP)** and deep app hooks to "act" on your behalf. Linked tools become skills your especialistas can use in real-time.
        </p>
      </div>

      <div className="flex gap-2 mb-10 p-1.5 bg-zinc-100 rounded-3xl w-fit">
        {[
          { id: "apps", label: "Supported Apps" },
          { id: "mcp", label: "MCP Servers" },
          { id: "social", label: "Social Hub" },
          { id: "storage", label: "Cloud Engine" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-white text-black shadow-xl" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "apps" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appIntegrations.map((item) => (
            <Card key={item.id} className="p-8 border-none bg-zinc-50/50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all group overflow-hidden relative border border-transparent hover:border-zinc-100">
              <div className="flex items-start justify-between relative z-10">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                {item.connected && <Check className="h-5 w-5 text-green-500" />}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-black font-heading uppercase tracking-tight mb-2">{item.name}</h3>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8">{item.description}</p>
                
                <Button className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  item.connected ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"
                }`}>
                  {item.connected ? "Manage Sync" : "Connect App"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "mcp" && (
        <div className="space-y-6">
          <Card className="p-12 border-zinc-100 rounded-[3rem] bg-zinc-50/30 overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center">
                  <Terminal className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-heading uppercase tracking-tight">Active MCP Servers</h3>
                  <p className="text-zinc-400 text-sm font-medium">Model Context Protocol (v1.2.0)</p>
                </div>
              </div>

              <div className="space-y-2">
                {mcpServers.map((server) => (
                  <div key={server.id} className="flex items-center justify-between p-6 bg-white rounded-2xl border border-zinc-50 shadow-sm">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center">
                        <Boxes className="h-5 w-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">{server.name}</p>
                        <p className="text-xs font-medium text-zinc-400">{server.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${server.status === "Configuring" ? "text-amber-500" : "text-green-500"}`}>
                        {server.status}
                      </span>
                      <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="mt-8 h-12 px-8 bg-black text-white hover:bg-zinc-800 rounded-xl font-black uppercase tracking-widest text-[10px]">
                Add Custom MCP Server
              </Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "social" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialIntegrations.map((item) => (
            <Card key={item.id} className="p-8 border-none bg-zinc-50/50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all group overflow-hidden relative border border-transparent hover:border-zinc-100">
               <div className="flex items-start justify-between relative z-10">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                {item.connected && <Check className="h-5 w-5 text-green-500" />}
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-black font-heading uppercase tracking-tight mb-2">{item.name}</h3>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-8">{item.description}</p>
                
                <Button className={`w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  item.connected ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-800"
                }`}>
                  {item.connected ? "Manage Sync" : "Connect Account"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "storage" && (
        <Card className="p-16 border-none bg-zinc-50/30 rounded-[3rem] text-center">
...
          <h3 className="text-2xl font-black font-heading uppercase tracking-tight mb-3">Enterprise Cloud Engine</h3>
          <p className="text-zinc-500 font-medium mb-10 max-w-sm mx-auto p-4 bg-white rounded-2xl border border-zinc-100/50">
            Securely save and retrieve your files using private S3/R2 vaults.
          </p>
          <Button className="h-16 px-16 bg-black text-white hover:bg-zinc-800 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-black/20 text-xs">
            Configure Storage Vault
          </Button>
        </Card>
      )}

      <div className="mt-20 p-8 bg-black rounded-[2.5rem] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-black uppercase tracking-widest text-sm">Enterprise Security</p>
            <p className="text-zinc-500 text-xs font-medium">OLLI-E uses AES-256 encryption for all linked credentials.</p>
          </div>
        </div>
        <Button variant="ghost" className="text-zinc-400 hover:text-white uppercase font-black text-xs tracking-widest">
          View Security Audit
        </Button>
      </div>
    </div>
  );
}
