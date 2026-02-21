import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Lock } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/app/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex flex-col items-center gap-0 mb-12 group">
        <Globe className="w-8 h-8 text-white mb-2 transition-transform group-hover:rotate-12" />
        <span className="font-black text-2xl tracking-[0.3em] uppercase leading-none text-white">RAW ARCHIVES</span>
        <span className="text-[9px] tracking-[0.6em] font-bold text-white/40 uppercase mt-2">Distribution Platform</span>
      </Link>

      <div className="w-full max-w-md bg-[#050505] border border-white/10 p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Member Login</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest">Access your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Email Address</label>
            <Input 
              type="email" 
              required 
              className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" 
              placeholder="name@label.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Password</label>
              <Link href="/forgot-password" className="text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Input 
                type="password" 
                required 
                className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0 pr-10" 
                placeholder="••••••••"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="bg-black border-white/20 rounded-none w-4 h-4 checked:bg-white" />
            <label htmlFor="remember" className="text-[10px] text-white/60 uppercase tracking-widest cursor-pointer">Remember me</label>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-xs font-black tracking-[0.3em] uppercase transition-all mt-4"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Don't have an account?{" "}
            <Link href="/register" className="text-white hover:underline underline-offset-4">
              Apply Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}