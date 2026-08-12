"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SlideCart() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, subtotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-brand-charcoal/40 backdrop-blur-sm z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-brand-softwhite shadow-large z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-brand-stone">
              <h2 className="font-display text-2xl text-brand-midnight">Your Bag</h2>
              <button 
                onClick={closeCart}
                className="text-brand-graphite hover:text-brand-midnight transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-brand-graphite text-sm">Your bag is currently empty.</p>
                  <button 
                    onClick={closeCart}
                    className="px-6 py-2 border border-brand-stone rounded-full text-sm font-medium hover:border-brand-midnight hover:text-brand-midnight transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-24 aspect-[3/4] bg-brand-stone/30 rounded overflow-hidden shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <Link 
                            href={`/shop/${item.product.id}`}
                            onClick={closeCart}
                            className="font-medium text-brand-charcoal text-sm hover:text-brand-champagne transition-colors line-clamp-2 pr-4"
                          >
                            {item.product.name}
                          </Link>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-brand-graphite hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <p className="text-xs text-brand-graphite mt-1 mb-2 capitalize">
                          {item.color} / {item.size}
                        </p>
                        
                        <div className="mt-auto flex justify-between items-center">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-3 border border-brand-stone rounded-full px-2 py-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-brand-graphite hover:text-brand-midnight"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-brand-graphite hover:text-brand-midnight"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <span className="font-semibold text-brand-midnight">
                            ${item.product.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-brand-stone bg-brand-softwhite">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-brand-charcoal font-medium uppercase tracking-wide text-sm">Subtotal</span>
                  <span className="text-xl font-medium text-brand-midnight">${subtotal}</span>
                </div>
                <p className="text-xs text-brand-graphite mb-6">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-brand-midnight text-brand-snow py-4 rounded-full font-medium shadow-soft hover:bg-brand-charcoal hover:shadow-medium transition-all"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
