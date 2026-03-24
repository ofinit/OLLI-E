"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, CreditCard, Landmark, Wallet } from "lucide-react";

export function WalletClient({ initialBalance }: { initialBalance: string }) {
  const [amount, setAmount] = useState("10");

  const handleCheckout = (gateway: string) => {
    // In production, this calls our backend to generate a checkout session for the specific provider
    alert(`Initiating ${gateway} checkout for $${amount}`);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">Token Wallet</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Coins className="h-5 w-5 text-blue-600" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold text-blue-700 dark:text-blue-400">{initialBalance}</p>
            <p className="text-sm text-slate-500 mt-2">Deducted strictly per-use</p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top Up Credits</CardTitle>
            <CardDescription>
              Add funds to your wallet to continue using Niche AI Tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold opacity-70">$</span>
              <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="text-lg text-left max-w-[120px]"
              />
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Payment Gateway</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-1 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  onClick={() => handleCheckout('Razorpay')}
                >
                  <CreditCard className="h-4 w-4 text-indigo-600 mb-1" />
                  <span>Razorpay</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-1 border-blue-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => handleCheckout('PayPal')}
                >
                  <Wallet className="h-4 w-4 text-blue-600 mb-1" />
                  <span>PayPal</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-1 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                  onClick={() => handleCheckout('Instamojo')}
                >
                  <Landmark className="h-4 w-4 text-emerald-600 mb-1" />
                  <span>Instamojo</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center gap-1 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
                  onClick={() => handleCheckout('Zwitch')}
                >
                  <CreditCard className="h-4 w-4 text-purple-600 mb-1" />
                  <span>Zwitch</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
