import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Register() {
  const { register, registerError, registerSuccess, clearErrors } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    labelName: "",
    country: "",
    timezone: "",
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      await register(form);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  if (registerSuccess) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#050505] border border-white/10 p-8 md:p-12 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-4" data-testid="text-register-success">Application Submitted</h1>
          <p className="text-sm text-white/40 mb-8">Your application has been submitted and is pending admin approval. You will be able to access the dashboard once approved.</p>
          <Link href="/login">
            <Button className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-xs font-black tracking-[0.3em] uppercase" data-testid="button-go-login">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

        {registerError && (
          <div className="mb-6 p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs uppercase tracking-widest text-center" data-testid="text-register-error">
            {registerError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Username *</label>
              <Input value={form.username} onChange={e => update("username", e.target.value)} required minLength={3} className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="myusername" data-testid="input-reg-username" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Full Name *</label>
              <Input value={form.fullName} onChange={e => update("fullName", e.target.value)} required className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="John Doe" data-testid="input-reg-fullname" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Email Address *</label>
            <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="name@label.com" data-testid="input-reg-email" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Password *</label>
            <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required minLength={6} className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="Min 6 characters" data-testid="input-reg-password" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Label / Artist Name</label>
            <Input value={form.labelName} onChange={e => update("labelName", e.target.value)} className="bg-black border-white/10 rounded-none h-12 text-sm focus:border-white focus:ring-0" placeholder="e.g. Void Circuit Records" data-testid="input-reg-label" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Country</label>
              <select value={form.country} onChange={e => update("country", e.target.value)} className="w-full bg-black border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none" data-testid="select-country">
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="tr">Turkey</option>
                <option value="jp">Japan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">Timezone</label>
              <select value={form.timezone} onChange={e => update("timezone", e.target.value)} className="w-full bg-black border border-white/10 rounded-none h-12 px-3 text-sm text-white focus:border-white focus:outline-none" data-testid="select-timezone">
                <option value="">Select Timezone</option>
                <option value="est">EST (UTC-5)</option>
                <option value="utc">UTC</option>
                <option value="cet">CET (UTC+1)</option>
                <option value="trt">TRT (UTC+3)</option>
              </select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-xs font-black tracking-[0.3em] uppercase transition-all mt-4"
            data-testid="button-register"
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
