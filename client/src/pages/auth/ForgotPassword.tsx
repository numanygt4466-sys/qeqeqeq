import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";
import SparkleText from "@/components/SparkleText";
import blingLogo from "@/assets/images/raw-archives-logo-bling.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-10 inline-block">
        <SparkleText color="rgba(180,160,100,0.8)" sparkleCount={4}>
          <img src={blingLogo} alt="Raw Archives Records" className="h-14 object-contain" />
        </SparkleText>
      </Link>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-1" data-testid="text-forgot-title">Reset Password</h1>
              <p className="text-sm text-gray-500">Enter your email address and we'll send you instructions to reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm bg-white text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="name@label.com"
                  data-testid="input-forgot-email"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-black hover:bg-gray-900 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
                data-testid="button-send-reset"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2" data-testid="text-check-email">Check Your Email</h2>
            <p className="text-sm text-gray-500 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the link to reset your password.
            </p>
            <p className="text-xs text-gray-400">Didn't receive the email? Check your spam folder or try again.</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-black hover:text-gray-700 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
