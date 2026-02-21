import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, loginError, clearErrors } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setIsLoading(true);
    try {
      await login(username, password);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-10">
          <h1 className="text-[22px] font-bold tracking-[0.2em] uppercase text-gray-900" data-testid="text-login-brand">
            RAW ARCHIVES
          </h1>
          <div className="w-12 h-[2px] bg-indigo-600 mx-auto mt-3" />
        </div>

        {loginError && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center" data-testid="text-login-error">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
              Username <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="h-11 bg-white border-gray-300 rounded text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder=""
              data-testid="input-username"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-gray-800 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-11 bg-white border-gray-300 rounded text-sm text-gray-900 pr-24 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder=""
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
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
            </div>
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-[13px] font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              data-testid="link-forgot-password"
            >
              Forgot Password?
            </button>
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

        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
          <p className="text-[13px] text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium" data-testid="link-register">
              Apply Now
            </Link>
          </p>
          <p className="text-[12px] text-gray-400">
            Difficulties logging in? Contact{" "}
            <a href="mailto:support@rawarchives.com" className="text-indigo-600 hover:text-indigo-700">
              support@rawarchives.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
