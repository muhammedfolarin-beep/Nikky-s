"use client";

import { useState } from "react";
import { Product } from "@/data/mockProducts";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");
  const { addItem } = useCart();

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="flex flex-col h-full lg:pl-10">
      {/* Header Info */}
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-wider uppercase text-brand-graphite mb-2">
          {product.brand}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-brand-midnight mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-4">
          <span className="font-sans text-2xl font-medium text-brand-midnight">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-lg text-brand-graphite line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>

      <hr className="border-brand-stone mb-8" />

      {/* Color Selection */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium uppercase tracking-wide text-brand-midnight">
            Color: <span className="text-brand-graphite capitalize ml-1">{/* We'd map hex to name here, hardcoding for visual */}Selected</span>
          </span>
        </div>
        <div className="flex gap-4">
          {product.colors.map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center
                ${selectedColor === color ? 'border-brand-champagne p-[2px]' : 'border-transparent hover:border-brand-stone'}
              `}
            >
              <span 
                className="w-full h-full rounded-full border border-black/10 block" 
                style={{ backgroundColor: color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium uppercase tracking-wide text-brand-midnight">
            Size: <span className="text-brand-graphite ml-1">{selectedSize || 'Select a size'}</span>
          </span>
          <button className="text-xs font-medium text-brand-champagne hover:text-brand-softgold underline underline-offset-4">
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`h-12 min-w-[3rem] px-4 flex items-center justify-center text-sm font-medium border rounded transition-colors
                ${selectedSize === size 
                  ? 'border-brand-midnight bg-brand-midnight text-brand-snow' 
                  : 'border-brand-stone text-brand-charcoal hover:border-brand-graphite'
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-xs text-brand-graphite mt-2">* Please select a size to continue</p>
        )}
      </div>

      {/* Add to Cart Actions */}
      <div className="flex gap-4 mb-12">
        {/* Quantity selector */}
        <div className="flex items-center justify-between border border-brand-stone rounded-full px-4 w-32 shrink-0">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-brand-graphite hover:text-brand-midnight py-4"
          >
            <Minus size={16} />
          </button>
          <span className="font-medium text-brand-charcoal">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="text-brand-graphite hover:text-brand-midnight py-4"
          >
            <Plus size={16} />
          </button>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`flex-1 rounded-full font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-soft hover:shadow-medium
            ${!selectedSize 
              ? 'bg-brand-stone text-brand-graphite cursor-not-allowed' 
              : 'bg-brand-midnight text-brand-snow hover:bg-brand-charcoal'
            }
          `}
        >
          <ShoppingBag size={18} />
          {selectedSize ? "Add to Bag" : "Select Size"}
        </button>

        <button 
          className="w-14 h-14 shrink-0 rounded-full border border-brand-stone flex items-center justify-center text-brand-charcoal hover:border-brand-champagne hover:text-brand-champagne transition-colors"
          title="Add to Wishlist"
        >
          <Heart size={20} />
        </button>
      </div>

      {/* Accordions */}
      <div className="border-t border-brand-stone">
        <AccordionItem 
          title="Description" 
          isOpen={expandedSection === "description"}
          onClick={() => toggleSection("description")}
        >
          {product.description}
        </AccordionItem>
        
        <AccordionItem 
          title="Material & Care" 
          isOpen={expandedSection === "material"}
          onClick={() => toggleSection("material")}
        >
          <p className="mb-2"><strong>Material:</strong> {product.material}</p>
          <p><strong>Care:</strong> {product.careInstructions}</p>
        </AccordionItem>

        <AccordionItem 
          title="Shipping & Returns" 
          isOpen={expandedSection === "shipping"}
          onClick={() => toggleSection("shipping")}
        >
          <p className="mb-2">Complimentary standard shipping on all orders over $200. Express shipping available at checkout.</p>
          <p>Enjoy free returns within 30 days of receiving your order. Items must be in original condition with tags attached.</p>
        </AccordionItem>
      </div>
    </div>
  );
}

// Helper component for Accordion
function AccordionItem({ title, isOpen, onClick, children }: { title: string, isOpen: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div className="border-b border-brand-stone">
      <button 
        onClick={onClick}
        className="w-full flex justify-between items-center py-5 text-left focus:outline-none group"
      >
        <span className="font-medium text-brand-midnight group-hover:text-brand-champagne transition-colors">{title}</span>
        <ChevronDown 
          size={18} 
          className={`text-brand-graphite transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
            <div className="pb-6 text-sm text-brand-graphite leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
