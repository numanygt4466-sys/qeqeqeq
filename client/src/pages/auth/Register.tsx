import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 py-12">
      <Link href="/" className="flex flex-col items-center gap-0 mb-12 group">
        <Globe className="w-8 h-8 text-white mb-2 transition-transform group-hover:rotate-12" />
        <span className="font-black text-2xl tracking-[0.3em] uppercase leading-none text-white">RAW ARCHIVES</span>
      </Link>

      <div className="w-full max-w-xl bg-[#050505] border border-white/10 p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Create Account</h1>
          <p className="text-xs text-white/40 uppercase tracking-widest">Apply for platform access</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Label / Artist Name</label>
              <Input required className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="e.g. Void Circuit Records" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Full Name</label>
              <Input required className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="John Doe" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Email Address</label>
            <Input type="email" required className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="name@label.com" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Password</label>
            <Input type="password" required className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="Min 8 characters" minLength={8} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Country</label>
              <select required className="w-full bg-black border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none">
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="jp">Japan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Timezone</label>
              <select required className="w-full bg-black border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none">
                <option value="">Select Timezone</option>
                <option value="est">EST (UTC-5)</option>
                <option value="utc">UTC</option>
                <option value="cet">CET (UTC+1)</option>
              </select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-xs font-black tracking-[0.3em] uppercase transition-all mt-4"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Already registered?{" "}
            <Link href="/login" className="text-white hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}