"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Automatically sign in the user after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError("Error signing in after registration");
        setIsLoading(false);
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
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
          <h1 className="font-display text-3xl text-brand-midnight mb-2">Create Account</h1>
          <p className="text-brand-charcoal/70 text-sm">Join to access premium collections and exclusive benefits</p>
        </div>

        {/* Google OAuth 1-Click Registration */}
        <button 
          type="button"
          onClick={handleGoogleSignUp}
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
          <span>Sign up with Google</span>
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-stone"></div>
          </div>
          <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-brand-charcoal/60 font-medium">
            Or register with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 border border-red-100 text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-brand-stone py-2 bg-transparent focus:outline-none focus:border-brand-midnight transition-colors"
              placeholder="Enter your full name"
            />
          </div>

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
              placeholder="Create a password (min 8 characters)"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 mt-4 text-sm font-medium"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-brand-charcoal">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-midnight font-medium hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
