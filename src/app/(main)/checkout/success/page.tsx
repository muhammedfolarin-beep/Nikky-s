"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, UserCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const guestEmail = searchParams.get("email") || "";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-softwhite px-4 py-12">
      <div className="max-w-lg w-full bg-white border border-brand-stone rounded-2xl p-8 sm:p-12 text-center shadow-medium">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 shadow-xs">
            <CheckCircle2 className="text-emerald-600" size={36} />
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-midnight text-brand-champagne text-[10px] uppercase font-mono font-bold tracking-widest mb-3">
          <Sparkles size={11} /> SN24 Atelier Confirmed
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-brand-midnight mb-3 tracking-tight font-bold">
          Order Received
        </h1>
        
        <p className="text-brand-graphite text-xs sm:text-sm mb-6 leading-relaxed">
          Thank you for choosing SN24. We have registered your order and your piece is scheduled for courier dispatch.
        </p>
        
        <div className="bg-brand-softwhite rounded-xl p-4 mb-6 text-left border border-brand-stone space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-brand-graphite font-semibold uppercase text-[10px]">Reference</span>
            <span className="text-brand-midnight font-mono font-bold">#SN24-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-brand-graphite font-semibold uppercase text-[10px]">Delivery Notice</span>
            <span className="text-brand-charcoal font-medium">Lagos 1–2 Days &bull; GIG Nationwide 3–5 Days</span>
          </div>
          {guestEmail && (
            <div className="flex justify-between items-center pt-2 border-t border-brand-stone/60">
              <span className="text-brand-graphite font-semibold uppercase text-[10px]">Receipt Sent To</span>
              <span className="text-brand-midnight font-mono truncate max-w-[200px]">{guestEmail}</span>
            </div>
          )}
        </div>

        {/* Dynamic CTA for Logged-in Account vs Guest */}
        {session?.user ? (
          <div className="space-y-3">
            <Link 
              href="/account" 
              className="flex items-center justify-center gap-2 w-full bg-brand-midnight text-brand-snow py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-charcoal transition-all shadow-soft"
            >
              <Package size={15} />
              <span>View Order in Account</span>
            </Link>
            <Link 
              href="/shop" 
              className="block w-full text-xs font-semibold text-brand-graphite hover:text-brand-midnight py-2 transition-colors"
            >
              Continue Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-brand-stone/30 border border-brand-stone/80 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck size={16} className="text-brand-midnight" />
                <span className="font-semibold text-xs text-brand-midnight">Save your details for next time?</span>
              </div>
              <p className="text-[11px] text-brand-graphite leading-relaxed mb-3">
                Create an account to track your orders, save bespoke measurements, and enjoy expedited checkout.
              </p>
              <Link
                href={`/register?email=${encodeURIComponent(guestEmail)}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-midnight hover:text-brand-champagne transition-colors"
              >
                <span>Create an Account</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <Link 
              href="/shop" 
              className="block w-full bg-brand-midnight text-brand-snow py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-charcoal transition-all shadow-soft"
            >
              Continue Shopping
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-midnight border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
