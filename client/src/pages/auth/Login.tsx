import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Disc, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const { login, loginError, clearErrors } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="flex items-center gap-2 mb-10">
        <Disc className="w-6 h-6 text-indigo-600" />
        <span className="font-bold text-lg tracking-wider uppercase text-gray-900">RAW ARCHIVES</span>
      </Link>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1" data-testid="text-login-title">Sign In</h1>
          <p className="text-sm text-gray-500">Access your dashboard</p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm text-center" data-testid="text-login-error">
            {loginError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input 
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
              className="h-11 border-gray-300 rounded-md" 
              placeholder="admin"
              data-testid="input-username"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
                className="h-11 border-gray-300 rounded-md pr-10" 
                placeholder="Enter password"
                data-testid="input-password"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-11 rounded-md font-medium"
            data-testid="button-login"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Apply Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
