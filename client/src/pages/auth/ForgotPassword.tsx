import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex flex-col items-center gap-0 mb-12 group">
        <Globe className="w-8 h-8 text-white mb-2 transition-transform group-hover:rotate-12" />
        <span className="font-black text-2xl tracking-[0.3em] uppercase leading-none text-white">RAW ARCHIVES</span>
      </Link>

      <div className="w-full max-w-md bg-[#050505] border border-white/10 p-8 md:p-12">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Reset Password</h1>
              <p className="text-xs text-white/40 uppercase tracking-widest">Enter your email to receive instructions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Email Address</label>
                <Input 
                  type="email" 
                  required 
                  className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" 
                  placeholder="name@label.com"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-xs font-black tracking-[0.3em] uppercase transition-all mt-4"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase mb-4">Check Your Email</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest leading-relaxed mb-8">
              We've sent password reset instructions to your email address.
            </p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}