"use client";

import { useCart, CartItem } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";
import { Clock, ShieldCheck, Sparkles, Truck, Lock, Mail } from "lucide-react";

interface OrderSummaryProps {
  shippingCost: number;
  shippingMethodName?: string;
}

export default function OrderSummary({
  shippingCost,
  shippingMethodName = "Local Dispatch"
}: OrderSummaryProps) {
  const { items, subtotal } = useCart();
  const { formatPrice } = useCurrency();

  const total = subtotal + shippingCost;

  return (
    <div className="bg-brand-snow border border-brand-stone p-6 md:p-7 rounded-2xl sticky top-8 shadow-sm space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-brand-stone pb-4">
        <h3 className="font-display text-xl text-brand-midnight">Order Summary</h3>
        <span className="text-xs font-mono font-bold bg-brand-stone/50 text-brand-charcoal px-2 py-0.5 rounded">
          {items.reduce((sum, item) => sum + item.quantity, 0)} Items
        </span>
      </div>

      {/* Delivery Notice */}
      <div className="bg-brand-midnight text-brand-snow p-4 rounded-xl border border-brand-champagne/40 space-y-2">
        <div className="flex items-center gap-2 text-brand-champagne font-bold text-xs uppercase tracking-wider">
          <Truck size={15} className="text-brand-champagne" />
          <span>Delivery Notice</span>
        </div>
        <p className="text-xs text-brand-silver/90 leading-relaxed font-light">
          Local Lagos orders are dispatched within <strong className="text-brand-snow font-semibold">1–2 business days</strong>. Nationwide interstate deliveries are routed via <strong className="text-brand-snow font-semibold">GIG Logistics Express (3–5 business days)</strong>.
        </p>
      </div>

      {/* Cart Items List */}
      <div className="space-y-4 max-h-[38vh] overflow-y-auto pr-1">
        {items.map((item: CartItem) => {
          const isCustom = item.size.toLowerCase().includes("custom") || !!item.customMeasurements;

          return (
            <div key={item.id} className="flex gap-3.5 items-center py-1">
              {/* Image & Count Badge */}
              <div className="relative w-16 aspect-[3/4] bg-brand-stone/30 rounded-lg overflow-hidden shrink-0 border border-brand-stone/40">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-1 right-1 bg-brand-midnight text-brand-snow text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {item.quantity}
                </span>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand-charcoal truncate">
                  {item.product.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] text-brand-graphite truncate">
                    {item.size}
                  </span>
                </div>

                {isCustom && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-brand-champagne bg-brand-midnight px-1.5 py-0.2 rounded mt-1">
                    <Sparkles size={8} /> Bespoke Tailored
                  </span>
                )}
              </div>

              {/* Item Price */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-brand-midnight">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <hr className="border-brand-stone" />

      {/* Financial Breakdown */}
      <div className="space-y-2.5 text-xs text-brand-graphite">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="text-brand-charcoal font-medium text-sm">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span>Shipping</span>
            <span className="text-[10px] text-brand-graphite bg-brand-stone/40 px-1.5 py-0.5 rounded">
              {shippingMethodName}
            </span>
          </div>
          <span className="text-brand-charcoal font-medium text-sm">
            {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-400">
          <span>Estimated VAT & Duties</span>
          <span>Included</span>
        </div>
      </div>

      <hr className="border-brand-stone" />

      {/* Total */}
      <div className="flex justify-between items-center pt-1">
        <div>
          <span className="font-display font-medium text-lg text-brand-midnight block">
            Grand Total
          </span>
          <span className="text-[10px] text-brand-graphite uppercase tracking-wider">
            All taxes & delivery calculated
          </span>
        </div>
        <span className="font-sans text-2xl font-bold text-brand-midnight">
          {formatPrice(total)}
        </span>
      </div>

      {/* Security & Quality Trust Footer */}
      <div className="pt-3 border-t border-brand-stone/60 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-brand-graphite">
          <span className="flex items-center gap-1">
            <Lock size={11} className="text-brand-champagne" /> 256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-brand-champagne" /> Authenticity Guaranteed
          </span>
        </div>
        <div className="text-center pt-1">
          <a href="mailto:hello@sn24.com.ng" className="text-[10px] font-semibold text-brand-midnight hover:text-brand-champagne transition-colors inline-flex items-center gap-1">
            <Mail size={11} className="text-brand-champagne" />
            <span>Questions? Email: <strong className="font-mono">hello@sn24.com.ng</strong></span>
          </a>
        </div>
      </div>
    </div>
  );
}
