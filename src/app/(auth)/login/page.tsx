"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setIsLoading(false);
    } else {
      window.location.href = "/home";
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="min-h-screen bg-brand-softwhite flex flex-col items-center justify-center p-4">
      <Link href="/home" className="absolute top-8 left-8 flex items-center gap-2.5 font-display font-semibold text-xl tracking-tight text-brand-midnight">
        <div className="relative w-8 h-8">
          <Image 
            src="/sn24-black-logo.png" 
            alt="SN24 Logo" 
            fill 
            className="object-contain" 
          />
        </div>
        SN24
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-sm border border-brand-stone">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-brand-midnight mb-2">Welcome Back</h1>
          <p className="text-brand-charcoal/70 text-sm">Sign in to access your exclusive benefits</p>
        </div>

        {/* Google OAuth 1-Click Login */}
        <button 
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-brand-stone bg-white text-brand-midnight text-sm font-medium hover:bg-neutral-50 transition-colors shadow-xs mb-6 disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-stone"></div>
          </div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-brand-charcoal/60 font-medium">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div data-testid="login-error-banner" className="bg-red-50 text-red-600 text-sm p-3 border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">Email Address</label>
            <input 
              id="email"
              data-testid="login-email-input"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-brand-stone py-2 bg-transparent focus:outline-none focus:border-brand-midnight transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">Password</label>
            <input 
              id="password"
              data-testid="login-password-input"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-brand-stone py-2 bg-transparent focus:outline-none focus:border-brand-midnight transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between items-center py-2">
            <label className="flex items-center gap-2 text-sm text-brand-charcoal cursor-pointer">
              <input type="checkbox" className="accent-brand-midnight" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm text-brand-charcoal hover:text-brand-midnight transition-colors underline-offset-2 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            data-testid="login-submit-btn"
            disabled={isLoading}
            className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 text-sm font-medium"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Sign In"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-brand-charcoal">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand-midnight font-medium hover:underline underline-offset-4">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
