"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/data/mockProducts";
import { useCurrency } from "@/context/CurrencyContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col gap-3 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.id}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-brand-stone/30 rounded-lg">
        {product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-brand-snow text-brand-midnight text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-soft">
            New
          </div>
        )}
        {product.isBestseller && !product.isNew && (
          <div className="absolute top-3 left-3 z-10 bg-brand-champagne text-brand-snow text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-soft">
            Bestseller
          </div>
        )}
        
        {/* Primary Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isHovered ? 'scale-105 opacity-0' : 'scale-100 opacity-100'}`}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Secondary Image (Hover) */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            className={`object-cover absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        )}
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/shop/${product.id}`} className="font-sans text-sm font-medium text-brand-charcoal hover:text-brand-champagne transition-colors line-clamp-1">
            {product.name}
          </Link>
          <span className="font-sans text-sm font-semibold text-brand-midnight whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="font-sans text-xs text-brand-graphite">{product.brand}</p>
        
        {/* Color Swatches */}
        <div className="flex gap-1.5 mt-1">
          {product.colors.map((color, idx) => (
            <div 
              key={idx} 
              className="w-3 h-3 rounded-full border border-brand-stone/50 shadow-sm"
              style={{ backgroundColor: color }}
              title={`Color option ${idx + 1}`}
            />
          ))}
          {product.colors.length > 3 && (
            <span className="text-[10px] text-brand-graphite flex items-center ml-1">+{product.colors.length - 3}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
