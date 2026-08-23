"use client";

import { usePaystackPayment } from 'react-paystack';

interface PaystackCheckoutButtonProps {
  config: any;
  onSuccess: (reference: any) => void;
  onClose: () => void;
  disabled: boolean;
  amountFormatted: string;
}

export default function PaystackCheckoutButton({ config, onSuccess, onClose, disabled, amountFormatted }: PaystackCheckoutButtonProps) {
  const initializePayment = usePaystackPayment(config);

  return (
    <button 
      onClick={() => {
        if (disabled) return;
        initializePayment({ onSuccess, onClose });
      }}
      disabled={disabled}
      className="w-full bg-brand-midnight text-brand-snow py-4 rounded-full font-medium hover:bg-brand-charcoal transition-colors shadow-soft flex justify-center items-center gap-2"
    >
      {disabled ? "Processing..." : `Place Order • ${amountFormatted}`}
    </button>
  );
}
