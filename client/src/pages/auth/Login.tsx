import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";
import SparkleText from "@/components/SparkleText";

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
          peer w-full h-[52px] px-4 pt-5 pb-1.5 text-sm text-gray-900 bg-white
          border rounded outline-none transition-colors duration-200
          ${focused ? "border-black ring-1 ring-black" : "border-gray-300"}
          ${children ? "pr-28" : ""}
        `}
        data-testid={testId}
      />
      <label
        htmlFor={id}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${isActive
            ? "top-2 text-[10px] font-bold text-gray-900 tracking-wide uppercase"
            : "top-1/2 -translate-y-1/2 text-sm text-gray-500"
          }
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10" data-testid="text-login-brand">
          <SparkleText color="rgba(0,0,0,0.6)" sparkleCount={5}>
            <h1 className="text-[26px] font-bold tracking-[0.2em] uppercase text-gray-900">RAW ARCHIVES</h1>
          </SparkleText>
          <div className="w-12 h-[2px] bg-black mx-auto mt-3" />
        </div>

        {loginError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center" data-testid="text-login-error">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-black transition-colors min-h-[44px] min-w-[44px] justify-center"
              tabIndex={-1}
              data-testid="button-toggle-password"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide password
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Show password
                </>
              )}
            </button>
          </FloatingInput>

          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-[13px] font-medium text-gray-600 hover:text-black transition-colors underline inline-flex items-center min-h-[44px]"
              data-testid="link-forgot-password"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-bold tracking-[0.15em] uppercase rounded transition-colors"
            data-testid="button-login"
          >
            {isLoading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
          <p className="text-[13px] text-gray-500 min-h-[44px] flex items-center justify-center">
            Don't have an account?{" "}
            <Link href="/register" className="text-gray-700 hover:text-black font-medium underline ml-1 inline-flex items-center min-h-[44px]" data-testid="link-register">
              Apply Now
            </Link>
          </p>
          <p className="text-[12px] text-gray-400 min-h-[44px] flex items-center justify-center">
            Difficulties logging in? Contact{" "}
            <a href="mailto:support@rawarchives.com" className="text-gray-600 hover:text-black underline ml-1 inline-flex items-center min-h-[44px]">
              support@rawarchives.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
