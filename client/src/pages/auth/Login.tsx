import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";
import SparkleText from "@/components/SparkleText";
import blingLogo from "@/assets/images/raw-archives-logo-bling.png";
import loginBg from "@/assets/images/login-bg.jpg";

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  testId,
  children,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  testId: string;
  children?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`
          peer w-full h-[52px] px-4 pt-5 pb-1.5 text-sm text-white bg-white/10 backdrop-blur-sm
          border rounded outline-none transition-all duration-200
          ${focused ? "border-white/50 ring-1 ring-white/30 bg-white/15" : "border-white/20"}
          ${children ? "pr-28" : ""}
        `}
        data-testid={testId}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isActive
            ? "top-2 text-[10px] font-bold text-white/80 tracking-wide uppercase"
            : "top-1/2 -translate-y-1/2 text-sm text-white/40"
          }
        `}
      >
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Login() {
  const { login, loginError, clearErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={loginBg} alt="" className="w-full h-full object-cover scale-110" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="text-center mb-10" data-testid="text-login-brand">
          <SparkleText color="rgba(255,255,255,0.9)" sparkleCount={6}>
            <img src={blingLogo} alt="Raw Archives Records" className="h-32 md:h-40 object-contain mx-auto opacity-60" />
          </SparkleText>
        </div>

        {loginError && (
          <div className="mb-5 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-200 text-sm text-center backdrop-blur-sm" data-testid="text-login-error">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <FloatingInput
            id="email"
            label="Email Address"
            type="text"
            value={email}
            onChange={setEmail}
            required
            testId="input-email"
          />

          <FloatingInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={setPassword}
            required
            testId="input-password"
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-white/50 hover:text-white transition-colors min-h-[44px] min-w-[44px] justify-center"
              tabIndex={-1}
              data-testid="button-toggle-password"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Show
                </>
              )}
            </button>
          </FloatingInput>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-white/50 hover:text-white transition-colors underline inline-flex items-center min-h-[44px]"
              data-testid="link-forgot-password"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-white hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed text-black text-[13px] font-bold tracking-[0.15em] uppercase rounded transition-colors"
            data-testid="button-login"
          >
            {isLoading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
          <p className="text-[13px] text-white/40 min-h-[44px] flex items-center justify-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-white/70 hover:text-white font-medium underline ml-1 inline-flex items-center min-h-[44px]" data-testid="link-register">
              Apply Now
            </Link>
          </p>
          <p className="text-[12px] text-white/30 min-h-[44px] flex items-center justify-center">
            Difficulties logging in? Contact{" "}
            <a href="mailto:support@rawarchives.com" className="text-white/50 hover:text-white underline ml-1 inline-flex items-center min-h-[44px]">
              support@rawarchives.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
