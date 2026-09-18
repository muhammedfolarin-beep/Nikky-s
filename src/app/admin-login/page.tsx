"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl: "/admin",
      });

      if (res?.error) {
        setError("Invalid admin credentials");
        setIsLoading(false);
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-brand-midnight text-white text-center py-10 px-6">
          <div className="relative w-14 h-14 mx-auto mb-3">
            <Image 
              src="/sn24-white-logo.png" 
              alt="SN24 Logo" 
              fill 
              className="object-contain" 
            />
          </div>
          <h1 className="text-2xl font-display font-semibold mb-2">Admin Portal</h1>
          <p className="text-white/70 text-sm">Sign in to access the control panel</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div data-testid="admin-login-error" className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                data-testid="admin-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-midnight/20 focus:border-brand-midnight transition-all"
                placeholder="admin@sn24.com.ng"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
              </div>
              <input
                id="password"
                data-testid="admin-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-midnight/20 focus:border-brand-midnight transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              data-testid="admin-login-submit"
              disabled={isLoading}
              className="w-full bg-brand-midnight text-white rounded-lg py-3.5 font-medium hover:bg-brand-charcoal transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {isLoading ? "Authenticating..." : "Sign In to Admin"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-brand-midnight transition-colors">
              &larr; Return to Storefront
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
