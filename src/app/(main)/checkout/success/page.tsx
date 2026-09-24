"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, UserCheck, Sparkles, Scissors, MapPin, Truck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { getOrderReceipt } from "@/lib/actions";
import { useCurrency } from "@/context/CurrencyContext";

function SuccessContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const guestEmail = searchParams.get("email") || "";
  const orderId = searchParams.get("orderId") || "";
  const paymentRef = searchParams.get("ref") || "";

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!orderId);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (orderId) {
      getOrderReceipt(orderId, guestEmail || paymentRef).then((res) => {
        if (res) {
          setOrder(res);
        }
        setIsLoading(false);
      });
    }
  }, [orderId, guestEmail, paymentRef]);

  const displayRef = order?.paymentRef || paymentRef || (orderId ? `#${orderId.slice(-8).toUpperCase()}` : "#SN24-ORDER");

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-softwhite px-4 py-16">
      <div className="max-w-xl w-full bg-white border border-brand-stone rounded-2xl p-6 sm:p-10 text-center shadow-medium">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 shadow-xs">
            <CheckCircle2 className="text-emerald-600" size={36} />
          </div>
        </div>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-midnight text-brand-champagne text-[10px] uppercase font-mono font-bold tracking-widest mb-3">
          <Sparkles size={11} /> SN24 Atelier Confirmed
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-brand-midnight mb-2 tracking-tight font-bold">
          Order Confirmed
        </h1>
        
        <p className="text-brand-graphite text-xs sm:text-sm mb-6 leading-relaxed">
          Thank you for choosing SN24. Your order has been registered and is being prepared for fulfillment.
        </p>
        
        {/* Order Receipt Box */}
        <div className="bg-brand-softwhite rounded-xl p-5 mb-6 text-left border border-brand-stone space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-brand-stone/60">
            <span className="text-brand-graphite font-semibold uppercase text-[10px]">Payment Reference</span>
            <span className="text-brand-midnight font-mono font-bold">{displayRef}</span>
          </div>

          {order && (
            <div className="flex justify-between items-center">
              <span className="text-brand-graphite font-semibold uppercase text-[10px]">Order Number</span>
              <span className="text-brand-midnight font-mono font-semibold">#{order.id.slice(-8).toUpperCase()}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-brand-graphite font-semibold uppercase text-[10px]">Fulfillment Status</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
              {order?.status ? order.status.replace(/_/g, " ") : "PAID & SCHEDULED"}
            </span>
          </div>

          {order?.items && order.items.length > 0 && (
            <div className="pt-2 border-t border-brand-stone/60 space-y-2">
              <span className="text-brand-graphite font-semibold uppercase text-[10px] block">Items in this Order</span>
              <div className="space-y-1.5">
                {order.items.map((item: any) => {
                  const isCustom = item.size?.toLowerCase().includes("custom") || item.size?.toLowerCase().includes("b:");
                  return (
                    <div key={item.id} className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-medium text-brand-charcoal">{item.name}</span>
                        <div className="text-[11px] text-brand-graphite flex items-center gap-1.5 mt-0.5">
                          <span>Qty: {item.quantity}</span>
                          {item.color && <span>&bull; {item.color}</span>}
                          {isCustom && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200">
                              <Scissors size={9} /> Custom Tailored
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono font-semibold text-brand-midnight">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order?.shippingAddress && (
            <div className="pt-2 border-t border-brand-stone/60 flex items-start gap-2">
              <Truck size={14} className="text-brand-midnight shrink-0 mt-0.5" />
              <div className="text-[11px] text-brand-charcoal leading-snug">
                <strong>Dispatch Destination:</strong> {order.shippingAddress}, {order.shippingCity}, {order.shippingState}
              </div>
            </div>
          )}

          {(guestEmail || order?.shippingEmail) && (
            <div className="flex justify-between items-center pt-2 border-t border-brand-stone/60">
              <span className="text-brand-graphite font-semibold uppercase text-[10px]">Receipt Dispatched To</span>
              <span className="text-brand-midnight font-mono truncate max-w-[220px]">{order?.shippingEmail || guestEmail}</span>
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
              <span>View Order in Account Dashboard</span>
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
                <span className="font-semibold text-xs text-brand-midnight">Save your details for future orders?</span>
              </div>
              <p className="text-[11px] text-brand-graphite leading-relaxed mb-3">
                Create an account to track your courier progress, save bespoke measurements, and enjoy expedited checkout.
              </p>
              <Link
                href={`/register?email=${encodeURIComponent(order?.shippingEmail || guestEmail)}`}
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
