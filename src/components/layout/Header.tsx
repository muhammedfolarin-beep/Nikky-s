"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import SlideCart from "@/components/cart/SlideCart";
import SearchOverlay from "@/components/layout/SearchOverlay";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const { openCart, totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-brand-charcoal text-brand-snow text-xs font-medium py-2 px-4 text-center tracking-wide">
        Get a Flat 10% Off on All Watches - Limited Time Only
      </div>
      <header className="w-full py-5 px-4 md:px-8 flex justify-between items-center border-b border-brand-stone bg-brand-softwhite relative z-40">
        
        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden flex items-center justify-center p-2 hover:text-brand-champagne transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 font-display font-semibold text-xl md:text-2xl tracking-tight text-brand-midnight absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <svg viewBox="0 0 100 100" className="h-6 w-auto md:h-8 text-brand-midnight" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" strokeLinejoin="miter">
            <path d="M 20 15 L 20 85" />
            <path d="M 20 15 L 65 75 C 75 88.3, 95 85, 95 65 C 95 50, 84 45, 70 45" />
            <path d="M 90 15 C 72 15, 57.5 17, 57.5 35 L 57.5 57" />
          </svg>
          Nikky's
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/home" className="hover:text-brand-champagne transition-colors duration-300">Home</Link>
          <Link href="/shop" className="hover:text-brand-champagne transition-colors duration-300">Shop</Link>
          <Link href="/collections" className="hover:text-brand-champagne transition-colors duration-300">Collections</Link>
          <Link href="/contact" className="hover:text-brand-champagne transition-colors duration-300">Contact Us</Link>
        </nav>

        {/* Icons */}
        <div className="flex gap-3 md:gap-4 text-sm font-medium items-center">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors duration-300 p-2 md:p-0"
          >
            <Search size={18} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Search</span>
          </button>
          
          <div className="hidden md:flex items-center gap-4 border-l border-r border-brand-stone px-4 mx-2">
            {session ? (
              <>
                <Link href="/account" className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors duration-300">
                  <User size={16} /> <span>{session.user?.name}</span>
                </Link>
                <button onClick={() => signOut()} className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors duration-300" title="Log Out">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors duration-300">
                <User size={16} /> <span>Login</span>
              </Link>
            )}
          </div>
          
          <button onClick={openCart} className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors duration-300 relative p-2 md:p-0">
            <ShoppingCart size={18} className="md:w-4 md:h-4" /> 
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 sm:-top-2 sm:-right-4 bg-brand-champagne text-brand-snow text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <SlideCart />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-midnight/40 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80vw] max-w-sm bg-brand-softwhite z-50 flex flex-col shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-brand-stone">
                <span className="font-display font-semibold text-2xl text-brand-midnight tracking-tight">Nikky's</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 hover:bg-brand-stone/50 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex flex-col py-6 px-6 gap-6 font-medium text-lg">
                <Link href="/home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-champagne transition-colors duration-300">Home</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-champagne transition-colors duration-300">Shop</Link>
                <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-champagne transition-colors duration-300">Collections</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-brand-champagne transition-colors duration-300">Contact Us</Link>
              </nav>

              <div className="mt-auto border-t border-brand-stone p-6 flex flex-col gap-4">
                {session ? (
                  <>
                    <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium hover:text-brand-champagne transition-colors">
                      <User size={20} /> My Account
                    </Link>
                    <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 font-medium hover:text-brand-champagne transition-colors text-left">
                      <LogOut size={20} /> Log Out
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 font-medium hover:text-brand-champagne transition-colors">
                    <User size={20} /> Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
