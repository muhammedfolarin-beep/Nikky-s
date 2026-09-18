"use client";

import { usePaystackPayment } from "react-paystack";
import { CreditCard, Lock, Building2, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { useState } from "react";
import type { HookConfig } from "react-paystack/dist/types";

export type PaystackConfig = HookConfig;

interface PaystackButtonProps {
  config: PaystackConfig | any;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  disabled?: boolean;
  amountFormatted: string;
}

export default function PaystackButton({
  config,
  onSuccess,
  onClose,
  disabled = false,
  amountFormatted
}: PaystackButtonProps) {
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize payment hook
  const initializePayment = usePaystackPayment(config);

  const handlePaymentClick = () => {
    if (disabled || isInitializing) return;

    if (!config?.publicKey) {
      alert("Paystack Public Key is missing. Please set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY in your environment.");
      return;
    }

    if (!config?.email) {
      alert("Please provide a valid email address before proceeding.");
      return;
    }

    // Support deterministic E2E mock testing
    if (typeof window !== "undefined" && (window as any).__PAYSTACK_TEST_MOCK__) {
      setIsInitializing(true);
      setTimeout(() => {
        setIsInitializing(false);
        if ((window as any).__PAYSTACK_TEST_MOCK__.shouldSucceed) {
          onSuccess({ reference: `E2E_MOCK_PAYSTACK_${Date.now()}` });
        } else {
          onClose();
        }
      }, 300);
      return;
    }

    setIsInitializing(true);
    try {
      initializePayment({
        onSuccess: (ref: any) => {
          setIsInitializing(false);
          onSuccess(ref);
        },
        onClose: () => {
          setIsInitializing(false);
          onClose();
        }
      });
    } catch (err) {
      console.error("Paystack initialization failed:", err);
      setIsInitializing(false);
      alert("Failed to initialize payment gateway. Please try again.");
    }
  };

  const isConfigured = Boolean(config?.publicKey);

  return (
    <div className="w-full space-y-4">
      {/* Channels Pill Badges */}
      <div className="bg-brand-stone/20 p-4 rounded-xl border border-brand-stone space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-midnight block">
          Accepted Payment Methods
        </span>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-brand-snow p-2.5 rounded-lg border border-brand-stone flex flex-col items-center justify-center gap-1">
            <CreditCard size={16} className="text-brand-midnight" />
            <span className="font-semibold text-brand-charcoal text-[11px]">Card</span>
            <span className="text-[9px] text-brand-graphite">Visa, MC, Verve</span>
          </div>
          <div className="bg-brand-snow p-2.5 rounded-lg border border-brand-stone flex flex-col items-center justify-center gap-1">
            <Building2 size={16} className="text-brand-midnight" />
            <span className="font-semibold text-brand-charcoal text-[11px]">Bank Transfer</span>
            <span className="text-[9px] text-brand-graphite">Instant Approval</span>
          </div>
          <div className="bg-brand-snow p-2.5 rounded-lg border border-brand-stone flex flex-col items-center justify-center gap-1">
            <Smartphone size={16} className="text-brand-midnight" />
            <span className="font-semibold text-brand-charcoal text-[11px]">USSD & QR</span>
            <span className="text-[9px] text-brand-graphite">All Banks</span>
          </div>
        </div>
      </div>

      {/* Main Payment Trigger Button */}
      {!isConfigured ? (
        <div className="w-full bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-full text-xs font-semibold text-center">
          ⚠️ Paystack Gateway is not configured (NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY required).
        </div>
      ) : (
        <button
          type="button"
          data-testid="paystack-pay-btn"
          onClick={handlePaymentClick}
          disabled={disabled || isInitializing}
          className={`w-full py-4 px-6 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-medium hover:shadow-large ${
            disabled || isInitializing
              ? "bg-brand-stone text-brand-graphite cursor-not-allowed"
              : "bg-brand-midnight text-brand-snow hover:bg-brand-charcoal active:scale-[0.99]"
          }`}
        >
          {isInitializing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-brand-snow border-t-transparent rounded-full animate-spin"></div>
              <span>Connecting to Paystack...</span>
            </div>
          ) : (
            <>
              <Lock size={15} className="text-brand-champagne" />
              <span>Pay via Card / Bank Transfer &bull; {amountFormatted}</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      )}

      {/* Security Guarantee Note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-brand-graphite">
        <ShieldCheck size={13} className="text-emerald-600" />
        <span>Payments securely processed and tokenized by Paystack Nigeria.</span>
      </div>
    </div>
  );
}
