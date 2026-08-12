"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { ChevronRight, CreditCard, Truck, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { processOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "card",
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  const [error, setError] = useState("");

  const getCardType = (number: string) => {
    if (number.startsWith("4")) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^506[0-1]/.test(number) || /^6500/.test(number) || /^5099/.test(number)) return "Verve";
    if (number.length > 0) return "Other Card";
    return "";
  };

  const handleNextStep = (currentStep: number) => {
    setError("");
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.state || !formData.zip) {
        setError("Please fill in all shipping details before continuing.");
        return;
      }
      setStep(2);
    } else if (currentStep === 2) {
      if (formData.paymentMethod === "card") {
        if (!formData.nameOnCard || !formData.cardNumber || !formData.expiry || !formData.cvc) {
          setError("Please fill in all card details before continuing.");
          return;
        }
      }
      setStep(3);
    }
  };

  const shippingCost = subtotal > 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-brand-softwhite">
        <h2 className="font-display text-3xl text-brand-midnight mb-4">Your bag is empty</h2>
        <p className="text-brand-graphite mb-8 text-center max-w-md">
          You need to add some items to your bag before you can checkout.
        </p>
        <button 
          onClick={() => router.push("/shop")}
          className="px-8 py-3 bg-brand-midnight text-brand-snow rounded-full font-medium hover:bg-brand-charcoal transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Process the actual order in the database
    const result = await processOrder({
      totalAmount: total,
      shippingName: `${formData.firstName} ${formData.lastName}`,
      shippingEmail: formData.email,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingState: formData.state,
      shippingZip: formData.zip,
      paymentRef: formData.paymentMethod === 'card' 
        ? `CARD-${Date.now()}` 
        : `${formData.paymentMethod.toUpperCase()}-${Date.now()}`
    }, items);

    if (result.success) {
      clearCart();
      router.push("/checkout/success");
    } else {
      setError("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-softwhite pt-8 pb-24 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Left Side: Checkout Form */}
        <div className="w-full lg:w-[60%]">
          <h1 className="font-display text-3xl text-brand-midnight mb-8 tracking-tight">Checkout</h1>
          
          <div className="space-y-6">
            
            {/* Step 1: Details & Shipping */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${step === 1 ? 'border-brand-midnight shadow-md bg-white' : 'border-brand-stone bg-transparent opacity-70'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <User size={20} className={step === 1 ? 'text-brand-midnight' : 'text-brand-graphite'} />
                  1. Details & Shipping
                </h3>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-xs font-medium text-brand-champagne hover:underline">
                    Edit
                  </button>
                )}
              </div>
              
              {step === 1 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  {error && step === 1 && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} type="text" placeholder="First Name" className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                    <input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                  </div>
                  <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                  <input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} type="text" placeholder="Street Address" className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne mt-4" />
                  <div className="grid grid-cols-3 gap-4">
                    <input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} type="text" placeholder="City" className="col-span-1 w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                    <input value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} type="text" placeholder="State/Province" className="col-span-1 w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                    <input value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})} type="text" placeholder="ZIP Code" className="col-span-1 w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      onClick={() => handleNextStep(1)}
                      className="bg-brand-midnight text-brand-snow py-3 px-8 rounded-full font-medium hover:bg-brand-charcoal transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${step === 2 ? 'border-brand-midnight shadow-md bg-white' : 'border-brand-stone bg-transparent opacity-70'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <CreditCard size={20} className={step === 2 ? 'text-brand-midnight' : 'text-brand-graphite'} />
                  2. Payment Method
                </h3>
                {step > 2 && (
                  <button onClick={() => setStep(2)} className="text-xs font-medium text-brand-champagne hover:underline">
                    Edit
                  </button>
                )}
              </div>
              
              {step === 2 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                  {error && step === 2 && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md mb-4">{error}</div>
                  )}
                  <div className="p-4 border border-brand-stone rounded-lg bg-brand-softwhite">
                    <div className="flex flex-col gap-4 mb-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({...formData, paymentMethod: 'card'})} className="accent-brand-midnight" />
                        <span className="font-medium text-brand-charcoal">Credit/Debit Card <span className="text-xs font-normal text-gray-500">(Visa, Mastercard, Verve)</span></span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="payment" value="opay" checked={formData.paymentMethod === 'opay'} onChange={() => setFormData({...formData, paymentMethod: 'opay'})} className="accent-brand-midnight" />
                        <span className="font-medium text-brand-charcoal">Opay</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="payment" value="palmpay" checked={formData.paymentMethod === 'palmpay'} onChange={() => setFormData({...formData, paymentMethod: 'palmpay'})} className="accent-brand-midnight" />
                        <span className="font-medium text-brand-charcoal">PalmPay</span>
                      </label>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4 pl-7 border-l-2 border-brand-stone ml-2">
                        <input value={formData.nameOnCard} onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})} type="text" placeholder="Name on Card" className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                        <div className="relative">
                          <input value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})} type="text" placeholder="Card Number" maxLength={19} className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                          {getCardType(formData.cardNumber) && (
                            <span className="absolute right-0 top-2 text-xs font-medium bg-brand-stone/30 px-2 py-1 rounded text-brand-midnight">
                              {getCardType(formData.cardNumber)}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                          <input value={formData.cvc} onChange={(e) => setFormData({...formData, cvc: e.target.value.replace(/\D/g, '')})} type="password" placeholder="CVC" maxLength={4} className="w-full bg-transparent border-b border-brand-stone py-2 text-brand-charcoal placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      onClick={() => handleNextStep(2)}
                      className="bg-brand-midnight text-brand-snow py-3 px-8 rounded-full font-medium hover:bg-brand-charcoal transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Step 3: Review */}
            <div className={`border rounded-xl p-6 transition-all duration-300 ${step === 3 ? 'border-brand-midnight shadow-md bg-white' : 'border-brand-stone bg-transparent opacity-70'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl flex items-center gap-2">
                  <Truck size={20} className={step === 3 ? 'text-brand-midnight' : 'text-brand-graphite'} />
                  3. Review & Confirm
                </h3>
              </div>
              
              {step === 3 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <div className="bg-brand-stone/20 p-5 rounded-lg mb-6 text-sm text-brand-charcoal">
                    <h4 className="font-semibold text-brand-midnight mb-3">Payment Preview</h4>
                    {formData.paymentMethod === 'card' ? (
                      <div className="space-y-2">
                        <p><span className="text-brand-graphite inline-block w-24">Method:</span> Credit/Debit Card</p>
                        <p><span className="text-brand-graphite inline-block w-24">Card Name:</span> <span className="font-medium">{formData.nameOnCard}</span></p>
                        <p><span className="text-brand-graphite inline-block w-24">Card Type:</span> <span className="font-medium">{getCardType(formData.cardNumber)}</span></p>
                        <p><span className="text-brand-graphite inline-block w-24">Card Number:</span> <span className="font-medium tracking-widest">**** **** **** {formData.cardNumber.slice(-4) || "****"}</span></p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p><span className="text-brand-graphite inline-block w-24">Method:</span> <span className="font-medium">{formData.paymentMethod === 'opay' ? 'Opay (Local Transfer)' : 'PalmPay (Local Transfer)'}</span></p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-brand-graphite mb-6">
                    Please review your order details on the right. By placing your order, you agree to Nikky's Terms & Conditions.
                  </p>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-brand-midnight text-brand-snow py-4 rounded-full font-medium hover:bg-brand-charcoal transition-colors shadow-soft flex justify-center items-center gap-2"
                  >
                    {isProcessing ? "Processing..." : `Place Order • $${total}`}
                  </button>
                </motion.div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:w-[40%]">
          <div className="bg-white border border-brand-stone p-6 rounded-xl sticky top-8 shadow-sm">
            <h3 className="font-display text-xl text-brand-midnight mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] bg-brand-stone/30 rounded overflow-hidden shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm font-medium text-brand-charcoal line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-brand-graphite capitalize mb-1">{item.color} / {item.size}</p>
                    <p className="text-xs text-brand-graphite">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-brand-midnight">${item.product.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <hr className="border-brand-stone mb-6" />
            
            <div className="space-y-3 text-sm text-brand-graphite mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-brand-charcoal font-medium">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-brand-charcoal font-medium">{shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-brand-champagne">* Free shipping on orders over $200</p>
              )}
            </div>
            
            <hr className="border-brand-stone mb-6" />
            
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-brand-midnight">Total</span>
              <span className="font-semibold text-brand-midnight">${total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
