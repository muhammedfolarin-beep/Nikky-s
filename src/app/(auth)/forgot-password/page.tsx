"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2, CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process request");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-brand-softwhite rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-stone">
              <Mail className="text-brand-midnight" size={26} />
            </div>
            <h1 className="font-display text-2xl text-brand-midnight mb-3">Check Your Inbox</h1>
            <p className="text-brand-charcoal/80 text-sm leading-relaxed mb-8">
              If an account is associated with <strong>{email}</strong>, we have dispatched a password reset link. Please check your inbox and spam folder.
            </p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors text-sm font-medium"
              >
                <ArrowLeft size={16} /> Return to Sign In
              </Link>
              <button
                onClick={() => { setIsSubmitted(false); setEmail(""); }}
                className="text-xs text-brand-charcoal/70 hover:text-brand-midnight transition-colors"
              >
                Did not receive the email? Try again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl text-brand-midnight mb-2">Reset Password</h1>
              <p className="text-brand-charcoal/70 text-sm">
                Enter your email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 border border-red-100 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-brand-midnight uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-brand-stone py-2 bg-transparent focus:outline-none focus:border-brand-midnight transition-colors placeholder:text-gray-400"
                  placeholder="Enter your registered email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-midnight text-white py-3 px-6 flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 text-sm font-medium"
              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Link"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-brand-charcoal">
              Remember your password?{" "}
              <Link href="/login" className="text-brand-midnight font-medium hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
