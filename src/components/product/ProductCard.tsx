"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/data/mockProducts";
import { useCurrency } from "@/context/CurrencyContext";
import { Eye, ShoppingBag, X, Sparkles, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewSize, setQuickViewSize] = useState<string | null>(product.sizes[0] || null);
  const [quickViewColor, setQuickViewColor] = useState<string>(product.colors[0] || "#16202C");
  const [quickViewImageIdx, setQuickViewImageIdx] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const isSN24 = product.collection?.toLowerCase().includes("sn24");

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!quickViewSize) return;

    addItem(product, 1, quickViewSize, quickViewColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setIsQuickViewOpen(false);
    }, 1200);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group flex flex-col gap-3.5 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Media Box */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F3F0] rounded-xl border border-brand-stone/40">
          {/* Status Badges */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
            {isSN24 && (
              <div className="bg-brand-midnight text-brand-snow text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded shadow-xs flex items-center gap-1 border border-brand-champagne/40">
                <Sparkles size={10} className="text-brand-champagne" />
                <span>SN24</span>
              </div>
            )}
            {product.isNew && !isSN24 && (
              <div className="bg-brand-snow text-brand-midnight text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-soft">
                New Arrival
              </div>
            )}
            {product.isBestseller && !product.isNew && !isSN24 && (
              <div className="bg-brand-champagne text-brand-midnight text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-soft">
                Bestseller
              </div>
            )}
            {discountPercent && (
              <div className="bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                -{discountPercent}%
              </div>
            )}
          </div>

          <Link href={`/shop/${product.id}`} className="block w-full h-full relative">
            {/* Primary Image */}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-700 ease-[0.22,1,0.36,1] ${
                isHovered && product.images[1] ? "scale-105 opacity-0" : "scale-100 opacity-100"
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            
            {/* Secondary Image (Hover) */}
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                className={`object-cover absolute inset-0 transition-all duration-700 ease-[0.22,1,0.36,1] ${
                  isHovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            )}
          </Link>

          {/* Quick View Button Hover Trigger */}
          <div className="absolute inset-x-3 bottom-3 z-20 transition-all duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setIsQuickViewOpen(true)}
              className="w-full bg-brand-softwhite/95 hover:bg-brand-midnight text-brand-midnight hover:text-brand-snow backdrop-blur-md py-2.5 rounded-lg text-xs font-semibold tracking-wider flex items-center justify-center gap-2 shadow-medium transition-all duration-200"
            >
              <Eye size={14} />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product Details & Price Tag */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-start gap-2">
            <Link 
              href={`/shop/${product.id}`} 
              className="font-sans text-sm font-semibold text-brand-midnight hover:text-brand-champagne transition-colors line-clamp-1"
            >
              {product.name}
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-sans text-xs text-brand-graphite">{product.brand}</p>
            
            {/* Price Tag with discount support */}
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-sm font-bold text-brand-midnight">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-sans text-xs text-brand-graphite line-through opacity-70">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Color Swatches Preview */}
          <div className="flex items-center gap-1.5 mt-1">
            {product.colors.map((color, idx) => (
              <div 
                key={idx} 
                className="w-3.5 h-3.5 rounded-full border border-brand-stone shadow-2xs"
                style={{ backgroundColor: color }}
                title={`Option ${idx + 1}`}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-brand-graphite font-mono ml-0.5">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickViewOpen(false)}
              className="fixed inset-0 bg-brand-midnight/70 backdrop-blur-sm"
            />

            {/* Quick View Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="relative w-full max-w-2xl bg-brand-softwhite rounded-2xl shadow-2xl border border-brand-stone overflow-hidden z-10 my-8 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsQuickViewOpen(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-brand-snow/80 hover:bg-brand-snow text-brand-midnight flex items-center justify-center shadow-xs transition-colors"
              >
                <X size={18} />
              </button>

              {/* Quick View Image Gallery */}
              <div className="w-full md:w-1/2 relative aspect-[3/4] bg-[#F5F4F0]">
                <Image
                  src={product.images[quickViewImageIdx] || product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2 px-4">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setQuickViewImageIdx(i)}
                        className={`w-10 h-10 rounded-md overflow-hidden border-2 relative ${
                          quickViewImageIdx === i ? "border-brand-champagne shadow-sm" : "border-white/60 opacity-80"
                        }`}
                      >
                        <Image src={img} alt="thumb" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick View Details & Sizing Form */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-brand-champagne font-bold">
                      {product.brand}
                    </span>
                    {isSN24 && (
                      <span className="text-[9px] font-bold bg-brand-midnight text-brand-snow px-1.5 py-0.5 rounded">
                        SN24
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl text-brand-midnight mb-2">
                    {product.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-brand-midnight">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-brand-graphite line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-brand-charcoal leading-relaxed line-clamp-3 mb-4">
                    {product.description || "Crafted with precision from premium sustainable materials, designed for timeless elegance."}
                  </p>

                  {/* Colors */}
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold uppercase text-brand-midnight block mb-2">
                      Color
                    </span>
                    <div className="flex gap-2">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setQuickViewColor(color)}
                          className={`w-7 h-7 rounded-full border-2 transition-all relative ${
                            quickViewColor === color ? "border-brand-midnight scale-110" : "border-transparent"
                          }`}
                        >
                          <span
                            className="w-full h-full rounded-full border border-black/10 block"
                            style={{ backgroundColor: color }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-semibold uppercase text-brand-midnight">
                        Size
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setQuickViewSize(size)}
                          className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                            quickViewSize === size
                              ? "bg-brand-midnight text-brand-snow border-brand-midnight"
                              : "bg-white text-brand-charcoal border-brand-stone hover:border-brand-midnight"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-brand-stone flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleQuickAddToCart}
                    className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-all ${
                      isAdded ? "bg-emerald-600 text-white" : "bg-brand-midnight hover:bg-brand-charcoal text-brand-snow"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span>Add to Bag &bull; {formatPrice(product.price)}</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/shop/${product.id}`}
                    onClick={() => setIsQuickViewOpen(false)}
                    className="w-full py-2 text-center text-xs font-semibold text-brand-graphite hover:text-brand-midnight flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>View Full Product & Tailoring Details</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
