"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleProviderClick = (e: React.MouseEvent, provider: string) => {
    e.preventDefault();
    signIn(provider.toLowerCase(), { callbackUrl: "/home" });
  };

  const handleCredentialsSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName || "Valued Client",
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please check your details.");
      }

      // Automatically sign in upon successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (signInRes?.error) {
        setError("Account created, but error signing in. Please proceed to login.");
        setIsLoading(false);
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during account creation.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-softwhite">
      {/* Left Side: Editorial Image */}
      <div className="relative hidden md:flex w-1/2 h-screen overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
          alt="Editorial Fashion"
          fill
          className="object-cover"
          priority
        />
        
        {/* Subtle Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-12 left-12 right-12">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-2xl shadow-large">
            <h2 className="font-display text-4xl text-brand-snow mb-4 leading-tight drop-shadow-md">
              Join the movement.
            </h2>
            <p className="font-sans text-brand-snow/90 text-sm tracking-wide">
              Create an account to unlock premium collections, exclusive sales, and a personalized experience.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full md:w-1/2 h-screen flex flex-col justify-center px-8 sm:px-16 lg:px-32 relative overflow-y-auto">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full mx-auto py-12"
        >
          <div className="text-center mb-10">
            <Link href="/home" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="relative w-10 h-10 group-hover:scale-105 transition-transform duration-300">
                <Image 
                  src="/sn24-black-logo.png" 
                  alt="SN24 Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-brand-midnight">
                SN24
              </span>
            </Link>
            <h1 className="font-display text-4xl text-brand-midnight mb-3 tracking-tight">Create an Account</h1>
            <p className="text-brand-graphite text-sm">Join SN24 to access your premium benefits.</p>
          </div>

          <form className="space-y-6" onSubmit={handleCredentialsSignup}>
            {error && (
              <div data-testid="signup-error-banner" className="bg-red-50 text-red-600 text-xs sm:text-sm p-3.5 rounded-xl border border-red-200 text-left font-medium leading-relaxed">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="firstName" className="text-xs font-medium text-brand-graphite tracking-wide uppercase">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  data-testid="signup-first-name"
                  className="w-full bg-transparent border-b border-brand-stone py-3 text-brand-charcoal focus:outline-none focus:border-brand-champagne transition-colors placeholder:text-brand-stone/60"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lastName" className="text-xs font-medium text-brand-graphite tracking-wide uppercase">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  data-testid="signup-last-name"
                  className="w-full bg-transparent border-b border-brand-stone py-3 text-brand-charcoal focus:outline-none focus:border-brand-champagne transition-colors placeholder:text-brand-stone/60"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-medium text-brand-graphite tracking-wide uppercase">Email Address</label>
              <input 
                type="email" 
                id="email" 
                data-testid="signup-email"
                className="w-full bg-transparent border-b border-brand-stone py-3 text-brand-charcoal focus:outline-none focus:border-brand-champagne transition-colors placeholder:text-brand-stone/60"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-medium text-brand-graphite tracking-wide uppercase">Password</label>
              <input 
                type="password" 
                id="password" 
                data-testid="signup-password"
                className="w-full bg-transparent border-b border-brand-stone py-3 text-brand-charcoal focus:outline-none focus:border-brand-champagne transition-colors placeholder:text-brand-stone/60"
                placeholder="Create a password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                data-testid="signup-submit-btn"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-brand-midnight text-brand-snow py-4 rounded-full font-medium shadow-soft hover:bg-brand-charcoal hover:shadow-medium transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading && <Loader2 className="animate-spin" size={18} />}
                <span>{isLoading ? "Validating & Creating..." : "Create Account"}</span>
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <hr className="w-full border-brand-stone" />
            <span className="px-4 text-xs font-medium text-brand-graphite whitespace-nowrap">OR CONTINUE WITH</span>
            <hr className="w-full border-brand-stone" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button onClick={(e) => handleProviderClick(e, "Google")} className="flex items-center justify-center gap-2 py-3 border border-brand-stone rounded-full text-sm font-medium text-brand-charcoal hover:bg-brand-mist transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Google
            </button>
            <button onClick={(e) => handleProviderClick(e, "Apple")} className="flex items-center justify-center gap-2 py-3 border border-brand-stone rounded-full text-sm font-medium text-brand-charcoal hover:bg-brand-mist transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.172 14.536c-.456.241-1.077.42-1.789.42-2.127 0-3.655-1.464-3.655-3.626 0-2.222 1.545-3.642 3.655-3.642.712 0 1.333.179 1.789.42v1.546c-.476-.299-1.037-.47-1.637-.47-1.129 0-1.921.841-1.921 2.146 0 1.288.775 2.13 1.921 2.13.6 0 1.161-.171 1.637-.47v1.546zm1.189-8.496c-.499 0-.903-.404-.903-.903s.404-.903.903-.903.903.404.903.903-.404.903-.903.903z"/>
                <path d="M15.42 16.141c-.469.314-1.096.536-1.895.536-2.525 0-4.321-1.803-4.321-4.31 0-2.523 1.78-4.325 4.321-4.325.799 0 1.426.222 1.895.536v1.655c-.534-.396-1.157-.611-1.821-.611-1.488 0-2.502 1.129-2.502 2.745 0 1.585 1.031 2.713 2.502 2.713.664 0 1.287-.215 1.821-.611v1.672z" fill="white"/>
              </svg>
              Apple
            </button>
          </div>

          <div className="mt-12 text-center text-sm text-brand-graphite">
            Already have an account? <Link href="/login" className="font-medium text-brand-midnight border-b border-brand-midnight pb-0.5 hover:text-brand-champagne hover:border-brand-champagne transition-colors">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
