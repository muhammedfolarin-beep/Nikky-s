"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/lib/actions";
import { Product } from "@/data/mockProducts"; // using this type for now
import ProductCard from "@/components/shop/ProductCard";
import ShopFilterSidebar from "@/components/shop/ShopFilterSidebar";
import ShopHeader from "@/components/shop/ShopHeader";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("featured");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data as Product[]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  // Extract unique filter options from products
  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  const sizes = useMemo(() => {
    const allSizes = products.flatMap(p => p.sizes);
    return Array.from(new Set(allSizes)).sort(); 
  }, [products]);
  
  // Hardcode color mapping for the mock products for display
  const colors = [
    { name: "Navy", hex: "#16202C" },
    { name: "Gold", hex: "#C9A96E" },
    { name: "Grey", hex: "#E4E7EB" },
    { name: "White", hex: "#FCFCFC" },
    { name: "Charcoal", hex: "#4A5565" },
    { name: "Black", hex: "#222831" },
    { name: "Brown", hex: "#8B4513" },
  ];

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => (selectedCategory ? p.category === selectedCategory : true))
      .filter(p => (selectedSizes.length > 0 ? p.sizes.some(s => selectedSizes.includes(s)) : true))
      .filter(p => (selectedColors.length > 0 ? p.colors.some(c => selectedColors.includes(c)) : true))
      .sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        if (sortOption === "newest") return (a.isNew ? -1 : (b.isNew ? 1 : 0));
        return 0; // featured/default
      });
  }, [selectedCategory, selectedSizes, selectedColors, sortOption, products]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (hex: string) => {
    setSelectedColors(prev => prev.includes(hex) ? prev.filter(c => c !== hex) : [...prev, hex]);
  };

  return (
    <div className="min-h-screen bg-brand-softwhite pt-12 pb-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-[1600px] mx-auto">
        <ShopHeader 
          totalProducts={filteredProducts.length}
          categoryName={selectedCategory || "All Collections"}
          gridCols={gridCols}
          setGridCols={setGridCols}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onMobileFilterToggle={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <ShopFilterSidebar 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sizes={sizes}
              selectedSizes={selectedSizes}
              onToggleSize={toggleSize}
              colors={colors}
              selectedColors={selectedColors}
              onToggleColor={toggleColor}
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                <p className="font-display text-2xl text-brand-midnight mb-2">No products found</p>
                <p className="text-brand-graphite">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                  }}
                  className="mt-6 px-6 py-2 bg-brand-midnight text-brand-snow rounded-full text-sm font-medium hover:bg-brand-charcoal transition-colors shadow-soft"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                className={`grid gap-x-6 gap-y-12 
                  grid-cols-2 
                  ${gridCols === 3 ? 'md:grid-cols-3' : ''} 
                  ${gridCols === 4 ? 'md:grid-cols-3 xl:grid-cols-4' : ''}
                  ${gridCols === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : ''}
                `}
              >
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-brand-softwhite overflow-y-auto p-4 lg:hidden pt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-2xl text-brand-midnight">Filters</h2>
            <button 
              onClick={() => setIsMobileFilterOpen(false)} 
              className="text-sm font-medium border border-brand-stone px-4 py-2 rounded-full"
            >
              Done
            </button>
          </div>
          <ShopFilterSidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sizes={sizes}
            selectedSizes={selectedSizes}
            onToggleSize={toggleSize}
            colors={colors}
            selectedColors={selectedColors}
            onToggleColor={toggleColor}
          />
        </div>
      )}
    </div>
  );
}
