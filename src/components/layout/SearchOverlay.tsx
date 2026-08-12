"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { mockProducts, Product } from "@/data/mockProducts";
import Image from "next/image";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = mockProducts.filter((p) => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 6)); // Limit to 6 results
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      setQuery("");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-brand-softwhite flex flex-col"
        >
          {/* Header */}
          <div className="w-full py-6 px-8 border-b border-brand-stone flex justify-between items-center bg-brand-softwhite relative z-10">
            <div className="flex-1 flex items-center">
              <Search size={24} className="text-brand-graphite mr-4" />
              <input
                autoFocus
                type="text"
                placeholder="Search for products, categories, or collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-xl md:text-3xl font-display text-brand-midnight focus:outline-none placeholder:text-brand-stone"
              />
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-brand-graphite hover:text-brand-midnight transition-colors"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto px-8 py-12">
            <div className="max-w-[1400px] mx-auto">
              
              {query.length > 1 && results.length === 0 && (
                <div className="text-center mt-20">
                  <p className="text-brand-graphite text-lg">No results found for "{query}"</p>
                  <p className="text-brand-stone mt-2 text-sm">Try searching for "Wool", "Leather", or "Accessories"</p>
                </div>
              )}

              {query.length <= 1 && (
                <div className="mt-8">
                  <h3 className="text-xs font-medium text-brand-graphite uppercase tracking-wide mb-6">Popular Searches</h3>
                  <div className="flex flex-wrap gap-3">
                    {["Cashmere", "Tailored", "Accessories", "Wool Coat"].map(term => (
                      <button 
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-6 py-2 border border-brand-stone rounded-full text-sm hover:border-brand-midnight hover:text-brand-midnight transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                  {results.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/shop/${product.id}`}
                      onClick={onClose}
                      className="group block"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-brand-stone/20 mb-4 rounded-sm">
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                        />
                      </div>
                      <h4 className="font-medium text-sm text-brand-charcoal truncate">{product.name}</h4>
                      <p className="text-brand-graphite text-xs mt-1">{formatPrice(product.price)}</p>
                    </Link>
                  ))}
                </motion.div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
