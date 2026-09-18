"use client";

import { useState } from "react";
import { Product } from "@/data/mockProducts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Ruler, 
  Sparkles, 
  Check, 
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import MeasurementModal from "@/components/product/MeasurementModal";

interface CustomizerFormProps {
  product: Product;
  onAddedToCart?: () => void;
}

export default function CustomizerForm({ product, onAddedToCart }: CustomizerFormProps) {
  const [mode, setMode] = useState<"standard" | "custom">("standard");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Custom Measurements State
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    hips: "",
    shoulder: "",
    sleeve: "",
    length: "",
    notes: ""
  });

  const { addItem } = useCart();
  const { formatPrice } = useCurrency();

  const handleMeasurementChange = (field: keyof typeof measurements, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = () => {
    if (mode === "standard" && !selectedSize) {
      alert("Please select a size first.");
      return;
    }

    if (mode === "custom") {
      // Require at least bust, waist or hips for custom fit
      if (!measurements.bust && !measurements.waist && !measurements.hips) {
        alert("Please enter your essential measurements (Bust, Waist, or Hips) for custom tailoring.");
        return;
      }
    }

    const finalSize = mode === "custom" 
      ? `Custom Bespoke (B:${measurements.bust || "Std"}, W:${measurements.waist || "Std"}, H:${measurements.hips || "Std"})` 
      : (selectedSize || "Standard");

    const customData = mode === "custom" ? measurements : undefined;

    addItem(product, quantity, finalSize, selectedColor, customData);

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);

    if (onAddedToCart) {
      onAddedToCart();
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      <MeasurementModal
        isOpen={isMeasurementModalOpen}
        onClose={() => setIsMeasurementModalOpen(false)}
      />

      {/* Mode Switcher: Standard vs Made-to-Measure */}
      <div className="bg-brand-stone/30 p-1 rounded-xl flex items-center border border-brand-stone">
        <button
          type="button"
          onClick={() => setMode("standard")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
            mode === "standard"
              ? "bg-brand-snow text-brand-midnight shadow-xs font-bold"
              : "text-brand-graphite hover:text-brand-midnight"
          }`}
        >
          <span>Ready-to-Wear</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
            mode === "custom"
              ? "bg-brand-midnight text-brand-snow shadow-xs font-bold"
              : "text-brand-graphite hover:text-brand-midnight"
          }`}
        >
          <Sparkles size={13} className={mode === "custom" ? "text-brand-champagne" : ""} />
          <span>Bespoke Custom Tailoring</span>
        </button>
      </div>

      {/* Color Swatch Picker */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-midnight">
            Select Color
          </span>
          <span className="text-xs text-brand-graphite font-mono">
            {product.colors.indexOf(selectedColor) + 1} of {product.colors.length} shades
          </span>
        </div>
        <div className="flex items-center gap-3">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              aria-label={`Select color ${color}`}
              className={`w-9 h-9 rounded-full border-2 transition-all relative flex items-center justify-center ${
                selectedColor === color
                  ? "border-brand-midnight scale-110 shadow-xs"
                  : "border-transparent hover:border-brand-stone"
              }`}
            >
              <span
                className="w-7 h-7 rounded-full border border-black/10 block"
                style={{ backgroundColor: color }}
              />
              {selectedColor === color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check size={12} className={color === "#FCFCFC" || color === "#FFFFFF" ? "text-black" : "text-white"} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Standard Size Selector Mode */}
      {mode === "standard" && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-midnight">
              Select Size
            </span>
            <button
              type="button"
              onClick={() => setIsMeasurementModalOpen(true)}
              className="text-xs font-semibold text-brand-champagne hover:text-brand-softgold flex items-center gap-1.5 transition-colors"
            >
              <Ruler size={13} />
              <span>How to Measure & Size Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`py-3 text-xs font-semibold rounded-lg border transition-all ${
                  selectedSize === size
                    ? "border-brand-midnight bg-brand-midnight text-brand-snow shadow-xs"
                    : "border-brand-stone text-brand-charcoal hover:border-brand-graphite bg-brand-snow"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Custom Made-to-Measure Inputs Mode */}
      {mode === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-5 bg-brand-snow rounded-xl border border-brand-stone shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-brand-stone/60 pb-3">
            <div>
              <h4 className="font-semibold text-xs text-brand-midnight uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-champagne" />
                Custom Tailoring Specification
              </h4>
              <p className="text-[11px] text-brand-graphite">
                Enter your measurements in inches or centimeters
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMeasurementModalOpen(true)}
              className="text-xs font-bold text-brand-midnight bg-brand-stone/40 hover:bg-brand-stone px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors"
            >
              <Ruler size={12} className="text-brand-champagne" />
              <span>Visual Guide</span>
            </button>
          </div>

          {/* Measurement Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
                Bust / Chest *
              </label>
              <input
                type="text"
                placeholder="e.g. 36 in / 92 cm"
                value={measurements.bust}
                onChange={(e) => handleMeasurementChange("bust", e.target.value)}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-md px-3 py-2 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
                Natural Waist *
              </label>
              <input
                type="text"
                placeholder="e.g. 28 in / 71 cm"
                value={measurements.waist}
                onChange={(e) => handleMeasurementChange("waist", e.target.value)}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-md px-3 py-2 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
                Hips / Seat *
              </label>
              <input
                type="text"
                placeholder="e.g. 39 in / 99 cm"
                value={measurements.hips}
                onChange={(e) => handleMeasurementChange("hips", e.target.value)}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-md px-3 py-2 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
                Shoulder Width
              </label>
              <input
                type="text"
                placeholder="e.g. 15.5 in"
                value={measurements.shoulder}
                onChange={(e) => handleMeasurementChange("shoulder", e.target.value)}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-md px-3 py-2 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
                Sleeve Length
              </label>
              <input
                type="text"
                placeholder="e.g. 23.5 in"
                value={measurements.sleeve}
                onChange={(e) => handleMeasurementChange("sleeve", e.target.value)}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-md px-3 py-2 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
                Desired Length
              </label>
              <input
                type="text"
                placeholder="e.g. 44 in (Midi)"
                value={measurements.length}
                onChange={(e) => handleMeasurementChange("length", e.target.value)}
                className="w-full bg-brand-softwhite border border-brand-stone rounded-md px-3 py-2 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
              />
            </div>
          </div>

          {/* Bespoke Notes */}
          <div>
            <label className="text-[11px] font-medium text-brand-charcoal block mb-1">
              Custom Tailoring Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please add 2 inches to hem, extra room around biceps, or modest neckline adjustment..."
              value={measurements.notes}
              onChange={(e) => handleMeasurementChange("notes", e.target.value)}
              className="w-full bg-brand-softwhite border border-brand-stone rounded-md p-2.5 text-xs text-brand-midnight placeholder:text-gray-400 focus:outline-none focus:border-brand-champagne"
            />
          </div>

          <p className="text-[10px] text-brand-graphite italic bg-brand-stone/20 p-2 rounded">
            ⚡ Bespoke orders undergo handcrafted 5–7 days artisan production prior to express dispatch.
          </p>
        </motion.div>
      )}

      {/* Quantity & Add to Cart Actions */}
      <div className="flex gap-3 pt-2">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between border border-brand-stone rounded-full px-3 py-2 bg-brand-snow w-28 shrink-0">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-brand-graphite hover:text-brand-midnight p-1"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs font-bold text-brand-midnight">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="text-brand-graphite hover:text-brand-midnight p-1"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add to Bag CTA */}
        <button
          type="button"
          data-testid="add-to-bag-button"
          onClick={handleAddToCart}
          className={`flex-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-soft hover:shadow-medium py-3.5 ${
            addedAnimation
              ? "bg-emerald-600 text-white"
              : "bg-brand-midnight hover:bg-brand-charcoal text-brand-snow"
          }`}
        >
          {addedAnimation ? (
            <>
              <Check size={16} />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              <span>
                {mode === "custom" ? "Add Bespoke Item" : "Add to Bag"} &bull; {formatPrice(product.price * quantity)}
              </span>
            </>
          )}
        </button>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => setIsLiked(!isLiked)}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
            isLiked
              ? "border-red-500 text-red-500 bg-red-50"
              : "border-brand-stone text-brand-charcoal hover:border-brand-champagne hover:text-brand-champagne bg-brand-snow"
          }`}
        >
          <Heart size={18} className={isLiked ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
}
