import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import SparkleText from "@/components/SparkleText";
import blingLogo from "@/assets/images/raw-archives-logo-bling.png";
import loginBg from "@/assets/images/login-bg.jpg";

export default function Login() {
  const { login, loginError, clearErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      await login(email, password);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={loginBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="text-center mb-10" data-testid="text-login-brand">
          <SparkleText color="rgba(255,255,255,0.9)" sparkleCount={6}>
            <img src={blingLogo} alt="Raw Archives Records" className="h-18 object-contain mx-auto" />
          </SparkleText>
        </div>

        {loginError && (
          <div className="mb-5 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm text-center backdrop-blur-sm" data-testid="text-login-error">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-[13px] font-medium text-white/70 mb-2">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[50px] px-4 text-[15px] text-white bg-white/10 border border-white/20 rounded outline-none transition-all duration-200 focus:border-white/50 focus:bg-white/15 backdrop-blur-sm placeholder:text-white/30"
              data-testid="input-email"
              placeholder="name@label.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-white/70 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[50px] px-4 text-[15px] text-white bg-white/10 border border-white/20 rounded outline-none transition-all duration-200 focus:border-white/50 focus:bg-white/15 backdrop-blur-sm placeholder:text-white/30"
              data-testid="input-password"
              placeholder="Enter password"
            />
          </div>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[13px] text-white/50 hover:text-white transition-colors inline-flex items-center min-h-[44px]"
              data-testid="link-forgot-password"
            >
              Forgot password
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[50px] bg-white text-black text-[14px] font-bold tracking-wide rounded hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            data-testid="button-login"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-[13px] text-white/40">
            Don't have an account?{" "}
            <Link href="/register" className="text-white/70 hover:text-white transition-colors underline" data-testid="link-register">
              Apply Now
            </Link>
          </p>
          <p className="text-[12px] text-white/30">
            Difficulties logging in? Contact{" "}
            <a href="mailto:support@rawarchives.com" className="text-white/50 hover:text-white transition-colors underline">
              support@rawarchives.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
