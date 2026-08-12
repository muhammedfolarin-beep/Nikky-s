import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-brand-softwhite px-4">
      <div className="max-w-md w-full bg-white border border-brand-stone rounded-2xl p-8 sm:p-12 text-center shadow-medium">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        
        <h1 className="font-display text-3xl text-brand-midnight mb-2 tracking-tight">Order Confirmed</h1>
        <p className="text-brand-graphite text-sm mb-8">
          Thank you for your purchase. We've sent a confirmation email to your inbox with your order details.
        </p>
        
        <div className="bg-brand-softwhite rounded-lg p-4 mb-8 text-left border border-brand-stone">
          <p className="text-xs font-medium text-brand-graphite uppercase tracking-wide mb-1">Order Number</p>
          <p className="text-brand-midnight font-medium">#NK-{Math.floor(Math.random() * 1000000)}</p>
        </div>
        
        <Link 
          href="/shop" 
          className="block w-full bg-brand-midnight text-brand-snow py-4 rounded-full font-medium hover:bg-brand-charcoal transition-colors shadow-soft"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
