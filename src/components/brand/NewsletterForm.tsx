"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 5000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-brand-champagne/15 border border-brand-champagne/30 text-brand-champagne p-3 rounded text-xs flex items-center gap-2 mb-6">
        <CheckCircle2 size={15} className="shrink-0" />
        <span>Welcome to the private capsule circle.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex group focus-within:ring-1 focus-within:ring-brand-champagne rounded-sm overflow-hidden mb-6 shadow-sm border border-white/10">
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address" 
        className="px-3.5 py-2.5 w-full text-xs text-brand-charcoal outline-none bg-brand-snow placeholder:text-brand-graphite/60 transition-colors" 
        aria-label="Email address for newsletter"
        required
      />
      <button 
        type="submit"
        className="bg-brand-champagne hover:bg-brand-softgold text-brand-midnight px-3.5 py-2.5 text-xs font-bold transition-colors duration-300 whitespace-nowrap flex items-center gap-1 cursor-pointer"
        aria-label="Subscribe"
      >
        <span>Join</span>
        <ArrowRight size={13} />
      </button>
    </form>
  );
}
