"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, LogOut, Menu, X, Sparkles, Mail } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import SlideCart from "@/components/cart/SlideCart";
import SearchOverlay from "@/components/layout/SearchOverlay";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  const { openCart, totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Luxury Announcement Bar */}
      <div className="w-full bg-brand-midnight text-brand-snow text-xs font-medium py-2.5 px-4 md:px-8 border-b border-brand-charcoal flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-brand-champagne text-[11px] uppercase tracking-widest font-semibold font-mono">
            <Sparkles size={11} className="text-brand-champagne" />
            SN24
          </span>
          <span className="hidden md:inline text-brand-graphite">&bull;</span>
          <span className="text-brand-silver/80 hidden md:inline text-[11px]">
            Lagos Local Dispatch & GIG Logistics Nationwide Express
          </span>
        </div>

        {/* Concierge Email / WhatsApp Link */}
        <div className="flex items-center gap-4">
          <a 
            href="mailto:hello@sn24.com.ng" 
            className="flex items-center gap-1.5 text-brand-champagne hover:text-brand-snow transition-colors duration-300 group text-[11px] font-mono"
            title="Email Concierge"
          >
            <Mail size={12} className="text-brand-champagne" />
            <span>hello@sn24.com.ng</span>
          </a>
        </div>
      </div>

      <header className="w-full py-4 md:py-5 px-4 md:px-8 flex justify-between items-center border-b border-brand-stone bg-brand-softwhite/95 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        
        {/* Mobile Hamburger Button */}
        <button 
          aria-label="Open Navigation Menu"
          className="md:hidden flex items-center justify-center p-2 text-brand-midnight hover:text-brand-champagne transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Brand Logo with SN24 Black Logo PNG */}
        <Link 
          href="/home" 
          className="flex items-center gap-3 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/sn24-black-logo.png"
              alt="SN24 Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-brand-midnight group-hover:text-brand-champagne transition-colors duration-300 leading-none">
              SN24
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-brand-graphite font-mono mt-1 hidden sm:block">
              Lagos
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs uppercase tracking-widest font-semibold text-brand-charcoal">
          <Link 
            href="/home" 
            className="hover:text-brand-champagne transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-champagne hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            className="hover:text-brand-champagne transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-champagne hover:after:w-full after:transition-all after:duration-300"
          >
            Catalog
          </Link>
          <Link 
            href="/collections/the-sn24-capsule" 
            className="text-brand-midnight font-bold flex items-center gap-1.5 hover:text-brand-champagne transition-colors duration-300 relative py-1"
          >
            <span>The SN24 Capsule</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-champagne animate-pulse"></span>
          </Link>
          <Link 
            href="/collections" 
            className="hover:text-brand-champagne transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-champagne hover:after:w-full after:transition-all after:duration-300"
          >
            Collections
          </Link>
          <Link 
            href="/contact" 
            className="hover:text-brand-champagne transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-brand-champagne hover:after:w-full after:transition-all after:duration-300"
          >
            Concierge
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex gap-2 md:gap-3 text-sm font-medium items-center">
          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            data-testid="search-trigger"
            aria-label="Search catalog"
            className="flex items-center gap-1.5 text-brand-charcoal hover:text-brand-champagne transition-colors duration-300 p-2 rounded-full hover:bg-brand-stone/40"
          >
            <Search size={18} />
            <span className="hidden lg:inline text-xs font-semibold uppercase tracking-wider">Search</span>
          </button>
          
          {/* User Account / Session */}
          <div className="hidden md:flex items-center gap-3 border-l border-brand-stone pl-3 ml-1">
            {session ? (
              <div className="flex items-center gap-2">
                <Link 
                  href="/account" 
                  data-testid="user-account-link"
                  className="flex items-center gap-1.5 text-brand-charcoal hover:text-brand-champagne transition-colors duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-midnight text-brand-snow flex items-center justify-center text-xs font-semibold font-mono">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[90px] truncate text-xs font-semibold">{session.user?.name || "Account"}</span>
                </Link>
                <button 
                  onClick={() => signOut()} 
                  data-testid="signout-button"
                  className="p-1 text-brand-graphite hover:text-brand-midnight transition-colors" 
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                data-testid="signin-link"
                className="flex items-center gap-1 text-brand-charcoal hover:text-brand-champagne transition-colors duration-300 text-xs font-semibold uppercase tracking-wider"
              >
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}
          </div>
          
          {/* Cart Trigger */}
          <button 
            onClick={openCart} 
            data-testid="cart-trigger"
            aria-label={`Open shopping cart with ${totalItems} items`}
            className="flex items-center gap-1.5 text-brand-midnight hover:text-brand-champagne transition-colors duration-300 relative p-2 rounded-full hover:bg-brand-stone/40 ml-1"
          >
            <ShoppingCart size={19} />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Bag</span>
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={totalItems}
                className="absolute -top-1 -right-1 bg-brand-midnight text-brand-snow border border-brand-softwhite text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-xs font-mono"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
        </div>
      </header>
      
      <SlideCart />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-brand-softwhite z-50 flex flex-col shadow-2xl md:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center p-6 border-b border-brand-stone">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9">
                    <Image
                      src="/sn24-black-logo.png"
                      alt="SN24 Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-display font-semibold text-2xl text-brand-midnight tracking-tight">SN24</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-brand-charcoal hover:bg-brand-stone/50 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Support CTA */}
              <div className="p-4 mx-4 mt-4 bg-brand-midnight text-brand-snow rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-brand-champagne font-mono font-bold uppercase block">SN24 Support</span>
                  <span className="text-xs font-mono">hello@sn24.com.ng</span>
                </div>
                <a
                  href="mailto:hello@sn24.com.ng"
                  className="bg-brand-champagne text-brand-midnight p-2 rounded-full flex items-center justify-center font-bold"
                  aria-label="Email Support"
                >
                  <Mail size={14} />
                </a>
              </div>
              
              <nav className="flex flex-col py-6 px-6 gap-5 font-semibold text-base text-brand-charcoal">
                <Link 
                  href="/home" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-brand-champagne transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-brand-champagne transition-colors"
                >
                  Catalog
                </Link>
                <Link 
                  href="/collections/the-sn24-capsule" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-brand-midnight font-bold flex items-center justify-between text-brand-champagne bg-brand-champagne/10 px-3 py-2 rounded-lg"
                >
                  <span>The SN24 Capsule</span>
                  <span className="text-xs uppercase font-mono bg-brand-midnight text-brand-snow px-2 py-0.5 rounded">Featured</span>
                </Link>
                <Link 
                  href="/collections" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-brand-champagne transition-colors"
                >
                  Collections
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="hover:text-brand-champagne transition-colors"
                >
                  Concierge & Contact
                </Link>
              </nav>

              <div className="mt-auto border-t border-brand-stone p-6 bg-brand-stone/20 flex flex-col gap-4">
                {session ? (
                  <>
                    <Link 
                      href="/account" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="flex items-center gap-3 font-medium text-brand-midnight hover:text-brand-champagne transition-colors"
                    >
                      <User size={18} /> My Account ({session.user?.name})
                    </Link>
                    <button 
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }} 
                      className="flex items-center gap-3 font-medium text-brand-graphite hover:text-red-500 transition-colors text-left"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center justify-center gap-2 bg-brand-midnight text-brand-snow py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-brand-charcoal transition-colors"
                  >
                    <User size={15} /> Sign In / Register
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
