"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!token || !email) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="font-display text-2xl text-brand-midnight mb-2">Invalid Reset Link</h2>
        <p className="text-brand-charcoal/80 text-sm mb-6">
          This password reset link is incomplete or missing necessary verification credentials.
        </p>
        <Link 
          href="/forgot-password" 
          className="inline-block bg-brand-midnight text-white py-3 px-6 text-sm font-medium hover:bg-black transition-colors"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="font-display text-2xl text-brand-midnight mb-3">Password Updated</h1>
        <p className="text-brand-charcoal/80 text-sm leading-relaxed mb-8">
          Your SN24 account password has been successfully updated. You can now sign in with your new credentials.
        </p>
        <Link 
          href="/login" 
          className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors text-sm font-medium"
        >
          Sign In Now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl text-brand-midnight mb-2">Create New Password</h1>
        <p className="text-brand-charcoal/70 text-sm">
          Please enter and confirm your new password for <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="space-y-1 relative">
          <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">
            New Password
          </label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-brand-stone py-2 pr-10 bg-transparent focus:outline-none focus:border-brand-midnight transition-colors placeholder:text-gray-400"
              placeholder="Minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2.5 text-gray-400 hover:text-brand-midnight transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">
            Confirm Password
          </label>
          <input 
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b border-brand-stone py-2 bg-transparent focus:outline-none focus:border-brand-midnight transition-colors placeholder:text-gray-400"
            placeholder="Re-enter your password"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 text-sm font-medium mt-4"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin" size={24} /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
