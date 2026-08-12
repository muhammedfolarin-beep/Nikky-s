"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      router.push("/home");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-brand-softwhite flex flex-col items-center justify-center p-4">
      <Link href="/home" className="absolute top-8 left-8 flex items-center gap-2 font-display font-semibold text-xl tracking-tight text-brand-midnight">
        <svg viewBox="0 0 100 100" className="h-6 w-auto text-brand-midnight" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" strokeLinejoin="miter">
          <path d="M 20 15 L 20 85" />
          <path d="M 20 15 L 65 75 C 75 88.3, 95 85, 95 65 C 95 50, 84 45, 70 45" />
          <path d="M 90 15 C 72 15, 57.5 17, 57.5 35 L 57.5 57" />
        </svg>
        Nikky's
      </Link>

      <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-sm border border-brand-stone">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-brand-midnight mb-2">Welcome Back</h1>
          <p className="text-brand-charcoal/70 text-sm">Sign in to access your exclusive benefits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">Email Address</label>
            <input 
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
            <Link href="#" className="text-sm text-brand-charcoal hover:text-brand-midnight transition-colors">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70"
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
