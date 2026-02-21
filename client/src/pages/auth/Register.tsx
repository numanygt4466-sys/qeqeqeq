import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import blingLogo from "@/assets/images/raw-archives-logo-bling.png";

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
    spotifyLink: "",
    catalogSize: "",
    currentRevenue: "",
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-register-success">Application Submitted</h1>
          <p className="text-sm text-gray-500 mb-6">Your application has been submitted and is pending admin approval. You'll be able to access the dashboard once approved.</p>
          <Link href="/login">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-md font-medium" data-testid="button-go-login">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:p-6 py-12 pb-safe">
      <Link href="/" className="mb-10 logo-shine inline-block">
        <img src={blingLogo} alt="Raw Archives Records" className="h-12 object-contain" />
      </Link>

      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Create Account</h1>
          <p className="text-sm text-gray-500">Apply for platform access</p>
        </div>

        {registerError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm text-center" data-testid="text-register-error">
            {registerError}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Username *</label>
              <Input value={form.username} onChange={e => update("username", e.target.value)} required minLength={3} className="h-11 border-gray-300 rounded-md" placeholder="myusername" data-testid="input-reg-username" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Full Name *</label>
              <Input value={form.fullName} onChange={e => update("fullName", e.target.value)} required className="h-11 border-gray-300 rounded-md" placeholder="John Doe" data-testid="input-reg-fullname" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address *</label>
            <Input type="email" value={form.email} onChange={e => update("email", e.target.value)} required className="h-11 border-gray-300 rounded-md" placeholder="name@label.com" data-testid="input-reg-email" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password *</label>
            <Input type="password" value={form.password} onChange={e => update("password", e.target.value)} required minLength={6} className="h-11 border-gray-300 rounded-md" placeholder="Min 6 characters" data-testid="input-reg-password" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Label / Artist Name</label>
            <Input value={form.labelName} onChange={e => update("labelName", e.target.value)} className="h-11 border-gray-300 rounded-md" placeholder="e.g. Void Circuit Records" data-testid="input-reg-label" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Spotify Artist Link *</label>
            <Input value={form.spotifyLink} onChange={e => update("spotifyLink", e.target.value)} required className="h-11 border-gray-300 rounded-md" placeholder="https://open.spotify.com/artist/..." data-testid="input-reg-spotify" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Total Catalog Size *</label>
              <select value={form.catalogSize} onChange={e => update("catalogSize", e.target.value)} required className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" data-testid="select-catalog-size">
                <option value="">Select catalog size</option>
                <option value="1-5">1–5 releases</option>
                <option value="6-20">6–20 releases</option>
                <option value="21-50">21–50 releases</option>
                <option value="51-100">51–100 releases</option>
                <option value="100+">100+ releases</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Current Monthly Revenue *</label>
              <select value={form.currentRevenue} onChange={e => update("currentRevenue", e.target.value)} required className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" data-testid="select-revenue">
                <option value="">Select revenue range</option>
                <option value="$0-$100">$0 – $100</option>
                <option value="$100-$500">$100 – $500</option>
                <option value="$500-$1,000">$500 – $1,000</option>
                <option value="$1,000-$5,000">$1,000 – $5,000</option>
                <option value="$5,000-$10,000">$5,000 – $10,000</option>
                <option value="$10,000+">$10,000+</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <select value={form.country} onChange={e => update("country", e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" data-testid="select-country">
                <option value="">Select Country</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="de">Germany</option>
                <option value="tr">Turkey</option>
                <option value="jp">Japan</option>
                <option value="kr">South Korea</option>
                <option value="br">Brazil</option>
                <option value="fr">France</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Timezone</label>
              <select value={form.timezone} onChange={e => update("timezone", e.target.value)} className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" data-testid="select-timezone">
                <option value="">Select Timezone</option>
                <option value="est">EST (UTC-5)</option>
                <option value="utc">UTC</option>
                <option value="cet">CET (UTC+1)</option>
                <option value="trt">TRT (UTC+3)</option>
                <option value="jst">JST (UTC+9)</option>
              </select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 text-white h-11 rounded-md font-medium mt-2"
            data-testid="button-register"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already registered?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
