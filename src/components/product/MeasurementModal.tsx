"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, Sparkles, Check, Info, ArrowRight } from "lucide-react";

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuidance?: () => void;
}

export default function MeasurementModal({
  isOpen,
  onClose,
  onSelectGuidance
}: MeasurementModalProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [genderTab, setGenderTab] = useState<"women" | "men">("women");

  const measurementGuides = {
    women: [
      {
        id: "bust",
        name: "1. Bust / Chest",
        instruction: "Wrap the measuring tape around the fullest part of your bust, keeping the tape level across your shoulder blades.",
        tip: "Wear your typical bra for the most accurate everyday silhouette.",
        rangeIn: "31\" - 44\"",
        rangeCm: "78 - 112 cm"
      },
      {
        id: "waist",
        name: "2. Natural Waist",
        instruction: "Measure around your natural waistline—the narrowest indentation above your navel and below your ribcage.",
        tip: "Keep one finger between the measuring tape and your body for breathing comfort.",
        rangeIn: "24\" - 38\"",
        rangeCm: "60 - 96 cm"
      },
      {
        id: "hips",
        name: "3. Hips / Seat",
        instruction: "Stand with feet together and measure around the fullest curve of your hips and buttocks.",
        tip: "Ensure the tape remains parallel to the floor all the way around.",
        rangeIn: "34\" - 48\"",
        rangeCm: "86 - 122 cm"
      },
      {
        id: "shoulder",
        name: "4. Shoulder to Shoulder",
        instruction: "Measure across the upper back from the tip of the left shoulder bone to the tip of the right shoulder bone.",
        tip: "Follow the natural curve of your upper back without slouching.",
        rangeIn: "14\" - 18\"",
        rangeCm: "36 - 46 cm"
      },
      {
        id: "sleeve",
        name: "5. Sleeve Length",
        instruction: "With your arm slightly bent at a 90° angle, measure from shoulder point down past elbow to your wrist bone.",
        tip: "A slight bend prevents sleeves from riding up when moving.",
        rangeIn: "22\" - 26\"",
        rangeCm: "56 - 66 cm"
      },
      {
        id: "length",
        name: "6. Garment / Dress Length",
        instruction: "Measure from the highest point of the shoulder (near the neck base) straight down to your desired hemline.",
        tip: "Midi dresses typically hit mid-calf (42\"-46\"), Maxi hits the ankle (54\"-58\").",
        rangeIn: "35\" - 58\"",
        rangeCm: "89 - 147 cm"
      }
    ],
    men: [
      {
        id: "chest",
        name: "1. Chest",
        instruction: "Measure around the fullest part of your chest, directly under the armpits and across shoulder blades.",
        tip: "Relax your arms and breathe naturally—do not puff out your chest.",
        rangeIn: "36\" - 48\"",
        rangeCm: "91 - 122 cm"
      },
      {
        id: "waist",
        name: "2. Trouser Waist",
        instruction: "Measure around the waist area where you normally secure your trousers or belt.",
        tip: "Do not pull tape too tight; keep comfortable ease for sitting.",
        rangeIn: "28\" - 42\"",
        rangeCm: "71 - 107 cm"
      },
      {
        id: "neck",
        name: "3. Collar / Neck",
        instruction: "Measure around the base of your neck where your shirt collar naturally sits.",
        tip: "Place index finger between tape and neck for comfortable buttoning.",
        rangeIn: "14.5\" - 18.5\"",
        rangeCm: "37 - 47 cm"
      },
      {
        id: "shoulder",
        name: "4. Shoulder Span",
        instruction: "Measure straight across the prominent points of both shoulder bones on your back.",
        tip: "Crucial for sharp, unwrinkled suit jacket and shirt tailoring.",
        rangeIn: "16\" - 21\"",
        rangeCm: "41 - 53 cm"
      },
      {
        id: "sleeve",
        name: "5. Sleeve Length",
        instruction: "Measure from the shoulder seam down along the outer arm to the base of the thumb/wrist.",
        tip: "For tailored shirts, cuff should rest 0.5 inches below jacket sleeve.",
        rangeIn: "24\" - 27\"",
        rangeCm: "61 - 69 cm"
      },
      {
        id: "inseam",
        name: "6. Inseam / Leg Length",
        instruction: "Measure from the lowest point of the crotch seam straight down the inside of the leg to the top of the shoe.",
        tip: "Or measure an existing well-fitting pair of trousers laid flat.",
        rangeIn: "29\" - 36\"",
        rangeCm: "74 - 91 cm"
      }
    ]
  };

  const activeGuides = measurementGuides[genderTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-midnight/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            data-testid="measurement-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 260 }}
            className="relative w-full max-w-3xl bg-brand-softwhite rounded-2xl shadow-2xl border border-brand-stone overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-brand-midnight text-brand-snow flex items-center justify-between border-b border-brand-charcoal shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-champagne bg-brand-champagne/10 px-2 py-0.5 rounded border border-brand-champagne/30">
                    Bespoke Tailoring
                  </span>
                  <span className="text-xs text-brand-silver/70">&bull; SN24</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-brand-snow flex items-center gap-2.5">
                  <Ruler size={24} className="text-brand-champagne" />
                  Visual How-to-Measure Guide
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close measurement guide"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-brand-snow flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-4 bg-brand-stone/20 border-b border-brand-stone flex flex-wrap items-center justify-between gap-4 shrink-0">
              {/* Gender selector */}
              <div className="flex bg-brand-snow rounded-lg p-1 border border-brand-stone shadow-xs">
                <button
                  onClick={() => setGenderTab("women")}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    genderTab === "women"
                      ? "bg-brand-midnight text-brand-snow shadow-xs"
                      : "text-brand-graphite hover:text-brand-midnight"
                  }`}
                >
                  Women&apos;s Sizing
                </button>
                <button
                  onClick={() => setGenderTab("men")}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    genderTab === "men"
                      ? "bg-brand-midnight text-brand-snow shadow-xs"
                      : "text-brand-graphite hover:text-brand-midnight"
                  }`}
                >
                  Men&apos;s Tailoring
                </button>
              </div>

              {/* Units switcher */}
              <div className="flex items-center gap-2 text-xs font-medium text-brand-charcoal">
                <span>Unit:</span>
                <div className="flex bg-brand-snow rounded-lg p-1 border border-brand-stone">
                  <button
                    onClick={() => setUnit("in")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      unit === "in"
                        ? "bg-brand-champagne text-brand-midnight"
                        : "text-brand-graphite"
                    }`}
                  >
                    Inches (in)
                  </button>
                  <button
                    onClick={() => setUnit("cm")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      unit === "cm"
                        ? "bg-brand-champagne text-brand-midnight"
                        : "text-brand-graphite"
                    }`}
                  >
                    Centimeters (cm)
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Guide Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              
              {/* Tips Banner */}
              <div className="bg-brand-champagne/10 border border-brand-champagne/30 rounded-xl p-4 flex items-start gap-3.5">
                <Sparkles size={20} className="text-brand-champagne shrink-0 mt-0.5" />
                <div className="text-xs text-brand-charcoal leading-relaxed">
                  <span className="font-bold text-brand-midnight block mb-0.5">
                    Artisan Advice for Custom Tailoring:
                  </span>
                  Use a flexible fabric measuring tape. Stand upright in your natural posture with bare feet or normal shoes. Avoid pulling the tape excessively tight; leave room for comfortable motion.
                </div>
              </div>

              {/* Grid of Step-by-Step Anatomy Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-5 rounded-xl bg-white border border-brand-stone hover:border-brand-champagne/70 transition-all duration-300 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2.5">
                        <h4 className="font-semibold text-sm text-brand-midnight font-sans">
                          {guide.name}
                        </h4>
                        <span className="text-[11px] font-mono font-bold bg-brand-stone/50 text-brand-midnight px-2 py-0.5 rounded">
                          {unit === "in" ? guide.rangeIn : guide.rangeCm}
                        </span>
                      </div>
                      <p className="text-xs text-brand-charcoal leading-relaxed mb-3">
                        {guide.instruction}
                      </p>
                    </div>
                    <div className="flex items-start gap-1.5 pt-2.5 border-t border-brand-stone/40 text-[11px] text-brand-graphite italic">
                      <Info size={13} className="text-brand-champagne shrink-0 mt-0.5" />
                      <span>{guide.tip}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready-to-Wear Standard Size Comparison Table */}
              <div className="pt-4 border-t border-brand-stone">
                <h4 className="font-display text-lg text-brand-midnight mb-3">
                  Standard Size Reference Chart
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-stone/30 text-brand-midnight uppercase font-semibold">
                        <th className="p-2.5 border border-brand-stone">Size</th>
                        <th className="p-2.5 border border-brand-stone">Bust/Chest ({unit})</th>
                        <th className="p-2.5 border border-brand-stone">Waist ({unit})</th>
                        <th className="p-2.5 border border-brand-stone">Hips ({unit})</th>
                        <th className="p-2.5 border border-brand-stone">UK / US Equivalent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-stone text-brand-charcoal">
                      <tr>
                        <td className="p-2.5 font-bold border border-brand-stone">XS</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "31-33\"" : "79-84 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "24-26\"" : "61-66 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "34-36\"" : "86-91 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">UK 6 / US 2</td>
                      </tr>
                      <tr className="bg-brand-softwhite/50">
                        <td className="p-2.5 font-bold border border-brand-stone">S</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "34-35\"" : "86-89 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "27-28\"" : "68-71 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "37-38\"" : "94-97 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">UK 8-10 / US 4-6</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold border border-brand-stone">M</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "36-38\"" : "91-96 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "29-31\"" : "73-79 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "39-41\"" : "99-104 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">UK 12 / US 8</td>
                      </tr>
                      <tr className="bg-brand-softwhite/50">
                        <td className="p-2.5 font-bold border border-brand-stone">L</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "39-41\"" : "99-104 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "32-34\"" : "81-86 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "42-44\"" : "107-112 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">UK 14 / US 10</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold border border-brand-stone">XL</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "42-45\"" : "107-114 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "35-38\"" : "89-96 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">{unit === "in" ? "45-48\"" : "114-122 cm"}</td>
                        <td className="p-2.5 border border-brand-stone">UK 16 / US 12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-white border-t border-brand-stone flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              <a
                href="https://wa.me/234800645597?text=Hello%20SN24,%20I'd%20like%20sizing%20guidance."
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-brand-midnight hover:text-brand-champagne flex items-center gap-2 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Need Sizing Advice? <strong className="text-emerald-700">Chat on WhatsApp &rarr;</strong></span>
              </a>
              <button
                onClick={() => {
                  if (onSelectGuidance) onSelectGuidance();
                  onClose();
                }}
                className="w-full sm:w-auto bg-brand-midnight text-brand-snow px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-charcoal transition-colors flex items-center justify-center gap-2 shadow-soft"
              >
                <span>Done, Back to Product</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
