"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ShopFilterSidebarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  sizes: string[];
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  colors: { name: string; hex: string }[];
  selectedColors: string[];
  onToggleColor: (hex: string) => void;
}

export default function ShopFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  sizes,
  selectedSizes,
  onToggleSize,
  colors,
  selectedColors,
  onToggleColor
}: ShopFilterSidebarProps) {
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);

  return (
    <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-8 pr-6">
      {/* Category Filter */}
      <div className="border-b border-brand-stone pb-6">
        <button 
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="flex justify-between items-center w-full text-sm font-semibold tracking-wide uppercase text-brand-midnight mb-4"
        >
          Category
          <ChevronDown size={16} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isCategoryOpen && (
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onSelectCategory(null)}
              className={`text-left text-sm transition-colors ${selectedCategory === null ? 'text-brand-champagne font-medium' : 'text-brand-graphite hover:text-brand-charcoal'}`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`text-left text-sm transition-colors ${selectedCategory === cat ? 'text-brand-champagne font-medium' : 'text-brand-graphite hover:text-brand-charcoal'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-brand-stone pb-6">
        <button 
          onClick={() => setIsSizeOpen(!isSizeOpen)}
          className="flex justify-between items-center w-full text-sm font-semibold tracking-wide uppercase text-brand-midnight mb-4"
        >
          Size
          <ChevronDown size={16} className={`transition-transform duration-300 ${isSizeOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isSizeOpen && (
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onToggleSize(size)}
                  className={`min-w-[40px] h-10 px-2 flex items-center justify-center text-xs font-medium border transition-all duration-200 
                    ${isSelected 
                      ? 'border-brand-midnight bg-brand-midnight text-brand-snow' 
                      : 'border-brand-stone text-brand-graphite hover:border-brand-graphite hover:text-brand-charcoal'
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-brand-stone pb-6">
        <button 
          onClick={() => setIsColorOpen(!isColorOpen)}
          className="flex justify-between items-center w-full text-sm font-semibold tracking-wide uppercase text-brand-midnight mb-4"
        >
          Color
          <ChevronDown size={16} className={`transition-transform duration-300 ${isColorOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isColorOpen && (
          <div className="flex flex-wrap gap-3">
            {colors.map(color => {
              const isSelected = selectedColors.includes(color.hex);
              return (
                <button
                  key={color.name}
                  onClick={() => onToggleColor(color.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 relative flex items-center justify-center
                    ${isSelected ? 'border-brand-champagne p-[2px]' : 'border-transparent hover:border-brand-stone'}
                  `}
                  title={color.name}
                >
                  <span 
                    className="w-full h-full rounded-full border border-black/10 block" 
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
