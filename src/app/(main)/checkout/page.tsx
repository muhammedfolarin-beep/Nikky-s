"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { processOrder } from "@/lib/actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  User, 
  Truck, 
  CreditCard, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  Lock
} from "lucide-react";

import AddressForm, { AddressFormData } from "@/components/checkout/AddressForm";
import ShippingSelector, { ShippingMethodId, getLagosLocalDispatchCost } from "@/components/checkout/ShippingSelector";
import OrderSummary from "@/components/checkout/OrderSummary";

const PaystackButton = dynamic(() => import("@/components/checkout/PaystackButton"), { ssr: false });

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const router = useRouter();
  
  // Support both logged-in users and guests
  const { data: session, status } = useSession();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Customer & Shipping Address State
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    state: "Lagos",
    city: "Lekki Phase 1 / Ikate",
    zip: "",
    notes: ""
  });

  // Securely pre-fill user data if logged in
  useEffect(() => {
    if (session?.user) {
      const nameParts = (session.user.name || "").split(" ");
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || nameParts[0] || "",
        lastName: prev.lastName || nameParts.slice(1).join(" ") || "",
        email: prev.email || session.user?.email || ""
      }));
    }
  }, [session]);

  // Shipping Method State
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("local_dispatch");
  const [shippingCost, setShippingCost] = useState<number>(4);

  // Update shipping method & cost
  const handleSelectShipping = (method: ShippingMethodId, cost: number) => {
    setShippingMethod(method);
    setShippingCost(cost);
  };

  // Adjust default shipping whenever state or city changes
  useEffect(() => {
    const isLagos = formData.state.toLowerCase().includes("lagos");
    const isInternational = formData.state.toLowerCase().includes("international");

    if (isLagos) {
      const lagosInfo = getLagosLocalDispatchCost(formData.city);
      setShippingMethod("local_dispatch");
      setShippingCost(lagosInfo.cost);
    } else if (isInternational) {
      setShippingMethod("international");
      setShippingCost(35);
    } else {
      // Interstate shipping outside Lagos strictly routes via GIG Logistics
      setShippingMethod("gig_logistics");
      setShippingCost(18);
    }
  }, [formData.state, formData.city]);

  const total = subtotal + shippingCost;

  const handleUpdateFormData = (updated: Partial<AddressFormData>) => {
    setFormData(prev => ({ ...prev, ...updated }));
    if (error) setError("");
  };

  const handleNextStep = (currentStep: number) => {
    setError("");

    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.state || !formData.city) {
        setError("Please complete all required shipping fields (*)");
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please provide a valid email address for order confirmation & tracking.");
        return;
      }
      setStep(2);
    } else if (currentStep === 2) {
      setStep(3);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-brand-softwhite">
        <div className="w-8 h-8 border-3 border-brand-midnight border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-brand-graphite text-xs font-mono">Securing checkout session...</p>
      </div>
    );
  }

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-brand-softwhite">
        <div className="w-16 h-16 rounded-full bg-brand-stone/40 flex items-center justify-center text-brand-midnight mb-6">
          <ShoppingBag size={28} />
        </div>
        <h2 className="font-display text-3xl text-brand-midnight mb-3">Your shopping bag is empty</h2>
        <p className="text-brand-graphite text-sm mb-8 text-center max-w-md">
          Explore our signature collections and ready-to-wear pieces to begin your order.
        </p>
        <button 
          onClick={() => router.push("/shop")}
          className="px-8 py-3.5 bg-brand-midnight text-brand-snow rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-charcoal transition-colors shadow-soft"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  // Paystack transaction configuration
  const paystackConfig = {
    reference: `SN24-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: formData.email,
    amount: Math.round(total * exchangeRate * 100), // Lowest currency unit (kobo/cents)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    currency: currency,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`
        },
        {
          display_name: "Shipping Method",
          variable_name: "shipping_method",
          value: shippingMethod
        },
        {
          display_name: "Delivery Destination",
          variable_name: "delivery_destination",
          value: `${formData.city}, ${formData.state}`
        }
      ]
    }
  };

  const onSuccess = async (reference: any) => {
    setIsProcessing(true);
    try {
      const result = await processOrder({
        totalAmount: total,
        shippingName: `${formData.firstName} ${formData.lastName}`,
        shippingEmail: formData.email,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingState: formData.state,
        shippingZip: formData.zip || "100001",
        paymentRef: reference.reference || `PAYSTACK-${Date.now()}`
      }, items);

      if (result.success) {
        clearCart();
        router.push(`/checkout/success?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError("Your payment was received, but there was an issue creating the order record. Please contact concierge support with your reference.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Order processing error:", err);
      setError("An unexpected error occurred. Please contact customer care with your payment reference.");
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    setIsProcessing(false);
  };

  const getShippingLabel = () => {
    if (shippingMethod === "local_dispatch") {
      const lagosInfo = getLagosLocalDispatchCost(formData.city);
      return `Local Dispatch (${lagosInfo.zoneName})`;
    }
    if (shippingMethod === "gig_logistics") {
      return "GIG Logistics Express (Interstate)";
    }
    return "International Priority Express";
  };

  return (
    <div className="min-h-screen bg-brand-softwhite pt-8 pb-24 px-4 md:px-8 lg:px-16 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Breadcrumb & Steps Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-stone">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-champagne font-bold">
              Secure Checkout &bull; SN24 Atelier
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-brand-midnight tracking-tight">
              Order Details & Payment
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              step >= 1 ? "bg-brand-midnight text-brand-snow" : "bg-brand-stone/40 text-brand-graphite"
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Shipping Address</span>
            </div>
            <div className="w-4 h-[1px] bg-brand-stone"></div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              step >= 2 ? "bg-brand-midnight text-brand-snow" : "bg-brand-stone/40 text-brand-graphite"
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Courier</span>
            </div>
            <div className="w-4 h-[1px] bg-brand-stone"></div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              step === 3 ? "bg-brand-midnight text-brand-snow" : "bg-brand-stone/40 text-brand-graphite"
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          
          {/* Left Side: Modular Checkout Steps */}
          <div className="w-full lg:w-[60%] space-y-6">
            
            {/* Step 1: Customer Details & Shipping Address */}
            <div className={`border-2 rounded-2xl p-6 md:p-8 transition-all duration-300 ${
              step === 1 ? "border-brand-midnight bg-white shadow-md" : "border-brand-stone bg-brand-softwhite/50"
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > 1 ? "bg-emerald-600 text-white" : "bg-brand-midnight text-brand-snow"
                  }`}>
                    {step > 1 ? <Check size={14} /> : "1"}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-brand-midnight">
                      Shipping & Delivery Address
                    </h3>
                    <p className="text-xs text-brand-graphite">
                      Select your state & area for accurate delivery routing
                    </p>
                  </div>
                </div>

                {step > 1 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-brand-champagne hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Account vs Guest status header badge */}
                  {session?.user ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                        <span>
                          Signed in as <strong>{session.user.name || session.user.email}</strong> &bull; Order will be linked to your account.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-brand-stone/30 border border-brand-stone text-brand-charcoal rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-brand-graphite shrink-0" />
                        <span>Checking out as <strong>Guest</strong>.</span>
                      </div>
                      <Link
                        href="/login?callbackUrl=/checkout"
                        className="text-brand-midnight hover:text-brand-champagne font-bold underline transition-colors"
                      >
                        Sign in for saved profile & order tracking &rarr;
                      </Link>
                    </div>
                  )}

                  <AddressForm
                    formData={formData}
                    onChange={handleUpdateFormData}
                    error={error}
                  />

                  <div className="pt-4 border-t border-brand-stone flex justify-end">
                    <button
                      type="button"
                      data-testid="continue-to-courier-btn"
                      onClick={() => handleNextStep(1)}
                      className="bg-brand-midnight hover:bg-brand-charcoal text-brand-snow py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-soft flex items-center gap-2"
                    >
                      <span>Continue to Courier Selection</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-xs text-brand-charcoal bg-brand-stone/20 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-midnight">{formData.firstName} {formData.lastName}</p>
                    <p className="text-brand-graphite">{formData.address}, {formData.city}, {formData.state}</p>
                    <p className="text-brand-graphite">{formData.phone} &bull; {formData.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Shipping Selector */}
            <div className={`border-2 rounded-2xl p-6 md:p-8 transition-all duration-300 ${
              step === 2 ? "border-brand-midnight bg-white shadow-md" : "border-brand-stone bg-brand-softwhite/50"
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > 2 ? "bg-emerald-600 text-white" : step === 2 ? "bg-brand-midnight text-brand-snow" : "bg-brand-stone text-brand-graphite"
                  }`}>
                    {step > 2 ? <Check size={14} /> : "2"}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-brand-midnight">
                      Courier & Delivery Method
                    </h3>
                    <p className="text-xs text-brand-graphite">
                      Lagos Local Dispatch or Nationwide GIG Logistics Express
                    </p>
                  </div>
                </div>

                {step > 2 && (
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-brand-champagne hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {step === 2 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <ShippingSelector
                    selectedMethod={shippingMethod}
                    onSelectMethod={handleSelectShipping}
                    selectedState={formData.state}
                    selectedCity={formData.city}
                    subtotal={subtotal}
                  />

                  <div className="pt-4 border-t border-brand-stone flex items-center justify-between">
                    <button
                      type="button"
                      data-testid="back-to-address-btn"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-brand-graphite hover:text-brand-midnight flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Address</span>
                    </button>

                    <button
                      type="button"
                      data-testid="proceed-to-payment-btn"
                      onClick={() => handleNextStep(2)}
                      className="bg-brand-midnight hover:bg-brand-charcoal text-brand-snow py-3.5 px-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-soft flex items-center gap-2"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ) : step > 2 ? (
                <div className="text-xs text-brand-charcoal bg-brand-stone/20 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-midnight">{getShippingLabel()}</p>
                    <p className="text-brand-graphite">Delivery fee: {formatPrice(shippingCost)}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Step 3: Payment via Paystack */}
            <div className={`border-2 rounded-2xl p-6 md:p-8 transition-all duration-300 ${
              step === 3 ? "border-brand-midnight bg-white shadow-md" : "border-brand-stone bg-brand-softwhite/50"
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === 3 ? "bg-brand-midnight text-brand-snow" : "bg-brand-stone text-brand-graphite"
                }`}>
                  3
                </div>
                <div>
                  <h3 className="font-display text-xl text-brand-midnight">
                    Payment & Confirmation
                  </h3>
                  <p className="text-xs text-brand-graphite">
                    Cards (Visa, Mastercard, Verve), Bank Transfer & USSD
                  </p>
                </div>
              </div>

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Order Review Snippet */}
                  <div className="bg-brand-stone/20 p-4 rounded-xl text-xs space-y-2 text-brand-charcoal">
                    <div className="flex justify-between">
                      <span className="text-brand-graphite">Recipient:</span>
                      <span className="font-semibold">{formData.firstName} {formData.lastName} ({formData.phone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-graphite">Delivery To:</span>
                      <span>{formData.address}, {formData.city}, {formData.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-graphite">Courier:</span>
                      <span>{getShippingLabel()}</span>
                    </div>
                  </div>

                  {/* Direct Paystack Trigger Button */}
                  <PaystackButton
                    config={paystackConfig}
                    onSuccess={onSuccess}
                    onClose={onClose}
                    disabled={isProcessing}
                    amountFormatted={formatPrice(total)}
                  />

                  <div className="pt-2 flex justify-start">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold text-brand-graphite hover:text-brand-midnight flex items-center gap-1.5"
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Courier Options</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Right Side: Order Summary & Delivery Notice */}
          <div className="w-full lg:w-[40%]">
            <OrderSummary
              shippingCost={shippingCost}
              shippingMethodName={getShippingLabel()}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
