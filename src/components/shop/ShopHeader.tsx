"use client";

import { SlidersHorizontal, LayoutGrid, Rows3 } from "lucide-react";

interface ShopHeaderProps {
  totalProducts: number;
  categoryName: string;
  gridCols: 2 | 3 | 4;
  setGridCols: (cols: 2 | 3 | 4) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
  onMobileFilterToggle: () => void;
}

export default function ShopHeader({
  totalProducts,
  categoryName,
  gridCols,
  setGridCols,
  sortOption,
  setSortOption,
  onMobileFilterToggle
}: ShopHeaderProps) {
  return (
    <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-4xl text-brand-midnight mb-2 capitalize">
          {categoryName}
        </h1>
        <p className="text-sm text-brand-graphite font-sans">
          Showing {totalProducts} results
        </p>
      </div>

      <div className="flex items-center gap-4 md:gap-6 mt-4 md:mt-0">
        {/* Mobile Filter Button */}
        <button 
          onClick={onMobileFilterToggle}
          className="lg:hidden flex items-center gap-2 text-sm font-medium text-brand-charcoal border border-brand-stone px-4 py-2 rounded-full"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="hidden sm:block text-xs font-medium text-brand-graphite uppercase tracking-wider">
            Sort By
          </label>
          <select 
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent text-sm font-medium text-brand-charcoal border-b border-brand-stone py-1.5 focus:outline-none focus:border-brand-champagne cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="newest">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Grid View Toggles (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2 border-l border-brand-stone pl-6">
          <button 
            onClick={() => setGridCols(2)}
            className={`p-1.5 rounded transition-colors ${gridCols === 2 ? 'text-brand-midnight bg-brand-stone/30' : 'text-brand-graphite hover:text-brand-midnight'}`}
            title="2 Columns"
          >
            <Rows3 size={20} className="rotate-90" />
          </button>
          <button 
            onClick={() => setGridCols(3)}
            className={`p-1.5 rounded transition-colors ${gridCols === 3 ? 'text-brand-midnight bg-brand-stone/30' : 'text-brand-graphite hover:text-brand-midnight'}`}
            title="3 Columns"
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setGridCols(4)}
            className={`hidden lg:block p-1.5 rounded transition-colors ${gridCols === 4 ? 'text-brand-midnight bg-brand-stone/30' : 'text-brand-graphite hover:text-brand-midnight'}`}
            title="4 Columns"
          >
            {/* Custom 4 grid icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
