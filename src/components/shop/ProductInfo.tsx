"use client";

import { useState } from "react";
import { Product } from "@/data/mockProducts";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Scissors, Clock, ShieldCheck } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import CustomizerForm from "@/components/product/CustomizerForm";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("description");
  const { formatPrice } = useCurrency();

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const isSN24 = product.collection?.toLowerCase().includes("sn24");

  return (
    <div className="flex flex-col h-full lg:pl-10 space-y-8">
      {/* Header Info */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-brand-champagne">
            {product.brand}
          </span>
          {isSN24 && (
            <span className="text-[10px] font-mono font-bold bg-brand-midnight text-brand-snow px-2 py-0.5 rounded border border-brand-champagne/40 flex items-center gap-1">
              <Sparkles size={10} className="text-brand-champagne" />
              The SN24 Capsule
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl lg:text-5xl text-brand-midnight mb-4 tracking-tight leading-tight">
          {product.name}
        </h1>

        <div className="flex items-baseline gap-4">
          <span className="font-sans text-2xl lg:text-3xl font-bold text-brand-midnight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="font-sans text-lg text-brand-graphite line-through opacity-70">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      <hr className="border-brand-stone" />

      {/* Interactive Customizer & Size Selection Form */}
      <CustomizerForm product={product} />

      {/* Bespoke Crafting Highlight */}
      <div className="bg-brand-stone/30 border border-brand-stone rounded-xl p-4 flex items-start gap-3">
        <Clock size={18} className="text-brand-champagne shrink-0 mt-0.5" />
        <div className="text-xs text-brand-charcoal leading-relaxed">
          <strong className="text-brand-midnight block mb-0.5">
            Bespoke Tailoring & Express Dispatch:
          </strong>
          Standard items ship in 24 hours. Custom made-to-measure pieces undergo 5–7 business days of artisan precision crafting prior to dispatch.
        </div>
      </div>

      {/* Accordions */}
      <div className="border-t border-brand-stone pt-2">
        <AccordionItem 
          title="Description & Silhouette" 
          isOpen={expandedSection === "description"}
          onClick={() => toggleSection("description")}
        >
          {product.description || "Designed with timeless elegance and sculpted proportions for effortless style."}
        </AccordionItem>
        
        <AccordionItem 
          title="Material & Sartorial Care" 
          isOpen={expandedSection === "material"}
          onClick={() => toggleSection("material")}
        >
          <p className="mb-2"><strong>Composition:</strong> {product.material || "Premium sustainable natural fibers."}</p>
          <p><strong>Care Instructions:</strong> {product.careInstructions || "Dry clean only. Cool iron. Store on contoured hangers."}</p>
        </AccordionItem>

        <AccordionItem 
          title="Shipping, Delivery & Returns" 
          isOpen={expandedSection === "shipping"}
          onClick={() => toggleSection("shipping")}
        >
          <p className="mb-2">
            <strong>Local Dispatch:</strong> 1–2 business days within Lagos.
          </p>
          <p className="mb-2">
            <strong>Nationwide GIG Logistics:</strong> 3–5 business days across Nigeria.
          </p>
          <p>
            Complimentary shipping on orders over {formatPrice(200)}. Hassle-free exchanges and returns within 14 days on ready-to-wear pieces.
          </p>
        </AccordionItem>
      </div>
    </div>
  );
}

function AccordionItem({ 
  title, 
  isOpen, 
  onClick, 
  children 
}: { 
  title: string; 
  isOpen: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-brand-stone">
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
      >
        <span className="font-semibold text-sm text-brand-midnight group-hover:text-brand-champagne transition-colors">
          {title}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-brand-graphite transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-midnight' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-xs text-brand-graphite leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
