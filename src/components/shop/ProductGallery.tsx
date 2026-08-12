"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-6 lg:gap-8 h-full">
      {/* Thumbnails (Desktop: Vertical Left, Mobile: Horizontal Bottom) */}
      <div className="flex md:flex-col gap-3 md:gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar md:w-20 lg:w-24 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative aspect-[3/4] w-20 md:w-full shrink-0 overflow-hidden rounded-md transition-all duration-300 ${
              activeIndex === idx 
                ? 'ring-1 ring-brand-midnight opacity-100' 
                : 'opacity-50 hover:opacity-100'
            }`}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* Main Large Image */}
      <div className="relative aspect-[3/4] md:aspect-auto md:flex-1 bg-brand-stone/20 rounded-xl overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full relative"
          >
            <Image
              src={images[activeIndex]}
              alt={`${productName} view ${activeIndex + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={activeIndex === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation Arrows */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between md:hidden pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="w-10 h-10 rounded-full bg-brand-snow/80 backdrop-blur flex items-center justify-center text-brand-midnight shadow-soft pointer-events-auto"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="w-10 h-10 rounded-full bg-brand-snow/80 backdrop-blur flex items-center justify-center text-brand-midnight shadow-soft pointer-events-auto"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots for mobile */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
          {images.map((_, idx) => (
            <div 
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${activeIndex === idx ? 'bg-brand-midnight' : 'bg-brand-midnight/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
