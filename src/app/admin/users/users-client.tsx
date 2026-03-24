"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Search, Mail, Wallet, ShieldCheck, Ban, UserCog } from "lucide-react";

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
    transition: { staggerChildren: 0.08 }
  }
};

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [search, setSearch] = useState("");
  
  const filteredUsers = initialUsers.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) || 
    user.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-black">User Management</h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">Manage accounts, verify wallet balances, and enforce platform access.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input 
              placeholder="Search users by email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border-zinc-200 rounded-xl pr-10 w-full md:w-64 focus-visible:ring-black/10"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
          </div>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={fadeUp}>
        <Card className="bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50/80 text-zinc-900 border-b border-black/5">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">User Identity</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">Join Date</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap text-right">Wallet Balance</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">Platform Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-xs whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 font-medium">
                      No users found.
                    </td>
                  </tr>
                ) : filteredUsers.map((user, i) => (
                  <tr 
                    key={user.id} 
                    className={`border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/20'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100/50 shrink-0 uppercase">
                          {user.email.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-black">{user.email}</p>
                          <p className="font-mono text-[10px] text-zinc-400 max-w-[120px] truncate" title={user.id}>{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-medium whitespace-nowrap">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-emerald-600 text-right">
                      ${user.balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        className={`shadow-none font-bold border-none px-2.5 py-0.5 ${
                          user.role === "Admin" ? "bg-violet-100 text-violet-700" :
                          user.role === "Enterprise" ? "bg-orange-100 text-orange-700" :
                          "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.status === "Active" ? (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        )}
                        <span className={`font-bold ${user.status === "Active" ? "text-emerald-700" : "text-red-700"}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1 pl-2">
                         <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Manage User">
                          <UserCog className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={user.status === "Active" ? "Suspend Account" : "Un-suspend"}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
