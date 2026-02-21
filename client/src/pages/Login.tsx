import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-black border-white/10 rounded-none overflow-hidden">
          <CardHeader className="text-center pb-8 border-b border-white/5">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-black tracking-tighter uppercase">Member Access</CardTitle>
            <CardDescription className="text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">
              Raw Archives Music Group Portal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Identity / Email</label>
                <Input 
                  type="email" 
                  required 
                  className="bg-transparent border-white/10 rounded-none h-14 focus:border-white focus:ring-0 transition-all" 
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Access Key</label>
                <div className="relative">
                  <Input 
                    type="password" 
                    required 
                    className="bg-transparent border-white/10 rounded-none h-14 focus:border-white focus:ring-0 transition-all pr-10" 
                    placeholder="••••••••"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-xs font-black tracking-[0.3em] uppercase transition-all mt-4"
              >
                {isLoading ? "Authenticating..." : "Initialize Session"}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <a href="#" className="text-[9px] font-bold tracking-[0.1em] uppercase text-white/20 hover:text-white transition-colors">
                Forgot access credentials?
              </a>
            </div>
          </CardContent>
        </Card>
        <p className="text-[8px] text-center text-white/20 mt-8 tracking-[0.4em] uppercase">
          Authorized Personnel Only • Secure Encryption Active
        </p>
      </motion.div>
    </div>
  );
}
