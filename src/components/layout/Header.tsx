"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import SlideCart from "@/components/cart/SlideCart";
import SearchOverlay from "@/components/layout/SearchOverlay";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { openCart, totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-brand-charcoal text-brand-snow text-xs font-medium py-2 px-4 text-center tracking-wide">
        Get a Flat 10% Off on All Watches - Limited Time Only
      </div>
      <header className="w-full py-6 px-8 flex justify-between items-center border-b border-brand-stone bg-brand-softwhite relative z-40">
        <Link href="/home" className="flex items-center gap-3 font-display font-semibold text-2xl tracking-tight text-brand-midnight">
          <svg viewBox="0 0 100 100" className="h-8 w-auto text-brand-midnight" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="butt" strokeLinejoin="miter">
            <path d="M 20 15 L 20 85" />
            <path d="M 20 15 L 65 75 C 75 88.3, 95 85, 95 65 C 95 50, 84 45, 70 45" />
            <path d="M 90 15 C 72 15, 57.5 17, 57.5 35 L 57.5 57" />
          </svg>
          Nikky's
        </Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/home" className="hover:text-brand-champagne transition-colors">Home</Link>
          <Link href="/shop" className="hover:text-brand-champagne transition-colors">Shop</Link>
          <Link href="/collections" className="hover:text-brand-champagne transition-colors">Collections</Link>
          <Link href="/contact" className="hover:text-brand-champagne transition-colors">Contact Us</Link>
        </nav>
        <div className="flex gap-4 text-sm font-medium items-center">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors"
          >
            <Search size={16} /> <span className="hidden sm:inline">Search</span>
          </button>
          
          {session ? (
            <div className="flex items-center gap-4 border-l border-r border-brand-stone px-4 mx-2">
              <Link href="/account" className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors">
                <User size={16} /> <span className="hidden sm:inline">{session.user?.name}</span>
              </Link>
              <button onClick={() => signOut()} className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors" title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors border-l border-r border-brand-stone px-4 mx-2">
              <User size={16} /> <span className="hidden sm:inline">Login</span>
            </Link>
          )}
          
          <button onClick={openCart} className="flex items-center gap-1.5 hover:text-brand-champagne transition-colors relative">
            <ShoppingCart size={16} /> 
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 sm:-right-4 bg-brand-champagne text-brand-snow text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      <SlideCart />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
