"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { Truck, Zap, Globe, CheckCircle2, ShieldCheck, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export type ShippingMethodId = "local_dispatch" | "gig_logistics" | "international";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  provider: string;
  timeframe: string;
  baseCost: number;
  description: string;
  isRecommended?: boolean;
}

interface ShippingSelectorProps {
  selectedMethod: ShippingMethodId;
  onSelectMethod: (method: ShippingMethodId, cost: number) => void;
  selectedState?: string;
  selectedCity?: string;
  subtotal: number;
}

/**
 * Calculates Lagos tiered local dispatch fee based on specific Lagos zone.
 * Always strictly lower than interstate GIG Logistics ($18).
 */
export function getLagosLocalDispatchCost(city: string = ""): { cost: number; zoneName: string } {
  const c = city.toLowerCase();

  // Island Core (Lekki, Ikoyi, VI)
  if (c.includes("lekki") || c.includes("ikoyi") || c.includes("victoria island") || c.includes("ajah") || c.includes("sangotedo")) {
    return { cost: 4, zoneName: "Lagos Island / Lekki Corridor" };
  }

  // Central Mainland (Ikeja, Surulere, Yaba, Maryland, Gbagada, Ogudu)
  if (c.includes("ikeja") || c.includes("surulere") || c.includes("yaba") || c.includes("maryland") || c.includes("gbagada") || c.includes("ogudu")) {
    return { cost: 5, zoneName: "Lagos Central Mainland" };
  }

  // Outer Mainland (Magodo, Festac, Alimosho, Egbeda, Agege, Oshodi, Apapa)
  if (c.includes("magodo") || c.includes("festac") || c.includes("alimosho") || c.includes("egbeda") || c.includes("agege") || c.includes("oshodi") || c.includes("apapa")) {
    return { cost: 6, zoneName: "Lagos Outer Mainland" };
  }

  // Far Outskirts (Ikorodu, Epe, Badagry)
  if (c.includes("ikorodu") || c.includes("epe") || c.includes("badagry")) {
    return { cost: 8, zoneName: "Lagos Outskirts" };
  }

  // Default Lagos rate
  return { cost: 5, zoneName: "Standard Lagos Zone" };
}

export default function ShippingSelector({
  selectedMethod,
  onSelectMethod,
  selectedState = "Lagos",
  selectedCity = "",
  subtotal
}: ShippingSelectorProps) {
  const { formatPrice } = useCurrency();

  const isLagos = selectedState.toLowerCase().includes("lagos");
  const isInternational = selectedState.toLowerCase().includes("international");
  const isInterstate = !isLagos && !isInternational;

  const lagosDispatchInfo = getLagosLocalDispatchCost(selectedCity);
  const lagosDispatchCost = lagosDispatchInfo.cost;
  const gigLogisticsCost = 18; // Interstate standard GIG rate

  // Determine available shipping methods based on destination rules
  const availableOptions: ShippingMethod[] = [];

  if (isLagos) {
    // 1. Local Dispatch (Lagos only, fee depends on zone, lesser than GIG)
    availableOptions.push({
      id: "local_dispatch",
      name: `Local Dispatch (${lagosDispatchInfo.zoneName})`,
      provider: "Lagos City Express Dispatch Rider",
      timeframe: "1 – 2 Business Days",
      baseCost: lagosDispatchCost,
      description: `Door-to-door direct courier rider across ${selectedCity || "Lagos"}.`,
      isRecommended: true
    });

    // Optional GIG option within Lagos
    availableOptions.push({
      id: "gig_logistics",
      name: "GIG Logistics Station Hub",
      provider: "GIG Logistics Lagos Hub",
      timeframe: "2 – 3 Business Days",
      baseCost: gigLogisticsCost,
      description: "Tracked shipment via GIG Logistics network.",
      isRecommended: false
    });
  } else if (isInterstate) {
    // 2. Interstate shipping: ONLY GIG Logistics allowed
    availableOptions.push({
      id: "gig_logistics",
      name: "GIG Logistics Express (Interstate)",
      provider: "GIG Logistics Nationwide Network",
      timeframe: "3 – 5 Business Days",
      baseCost: gigLogisticsCost,
      description: `Mandatory end-to-end tracked courier transit from Lagos to ${selectedState}.`,
      isRecommended: true
    });
  } else if (isInternational) {
    // 3. International shipping
    availableOptions.push({
      id: "international",
      name: "International Priority Courier",
      provider: "DHL / FedEx Global Express",
      timeframe: "5 – 7 Business Days",
      baseCost: 35,
      description: "Priority international air freight with customs clearance.",
      isRecommended: true
    });
  }

  // Auto-align selectedMethod if the previous selection is not allowed for this region
  useEffect(() => {
    const isCurrentMethodValid = availableOptions.some(opt => opt.id === selectedMethod);
    if (!isCurrentMethodValid && availableOptions.length > 0) {
      onSelectMethod(availableOptions[0].id, availableOptions[0].baseCost);
    } else {
      const currentOpt = availableOptions.find(opt => opt.id === selectedMethod);
      if (currentOpt && currentOpt.baseCost !== undefined) {
        onSelectMethod(currentOpt.id, currentOpt.baseCost);
      }
    }
  }, [selectedState, selectedCity]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-brand-midnight">
            Select Delivery Method
          </h3>
          <p className="text-xs text-brand-graphite">
            {isLagos 
              ? "Local Lagos courier dispatch (tiered by zone, lower than interstate GIG)" 
              : isInterstate 
              ? "Interstate deliveries are routed exclusively via GIG Logistics nationwide" 
              : "International air priority shipping"}
          </p>
        </div>

        {selectedState && (
          <span className="text-[11px] font-mono font-medium bg-brand-stone/40 text-brand-midnight px-2.5 py-1 rounded-md border border-brand-stone flex items-center gap-1">
            <MapPin size={12} className="text-brand-champagne" />
            {selectedState} {selectedCity ? `(${selectedCity})` : ""}
          </span>
        )}
      </div>

      {/* Options Cards */}
      <div className="grid grid-cols-1 gap-3.5">
        {availableOptions.map((option) => {
          const isSelected = selectedMethod === option.id;

          return (
            <motion.div
              key={option.id}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelectMethod(option.id, option.baseCost)}
              className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? "border-brand-midnight bg-brand-snow shadow-md"
                  : "border-brand-stone bg-brand-softwhite/60 hover:border-brand-graphite/40 hover:bg-brand-snow"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Icon Circle */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-brand-midnight text-brand-snow"
                      : "bg-brand-stone/40 text-brand-charcoal"
                  }`}
                >
                  {option.id === "local_dispatch" && <Zap size={20} />}
                  {option.id === "gig_logistics" && <Truck size={20} />}
                  {option.id === "international" && <Globe size={20} />}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-sm text-brand-midnight">
                      {option.name}
                    </h4>
                    {option.isRecommended && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-champagne/20 text-brand-midnight px-2 py-0.5 rounded border border-brand-champagne/40">
                        {isLagos ? "Best Local Rate" : "Required Interstate Carrier"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-graphite leading-relaxed">
                    {option.description}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-medium text-brand-midnight">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-brand-champagne" />
                      {option.timeframe}
                    </span>
                    <span>&bull;</span>
                    <span className="text-brand-graphite">{option.provider}</span>
                  </div>
                </div>
              </div>

              {/* Price & Selection Indicator */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-brand-stone shrink-0 gap-1.5">
                <span className="font-sans font-bold text-base text-brand-midnight">
                  {formatPrice(option.baseCost)}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-brand-graphite">
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-midnight">
                      <CheckCircle2 size={16} className="text-brand-midnight fill-brand-champagne" />
                      <span>Selected</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-gray-400">Click to choose</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interstate Notice */}
      {isInterstate && (
        <div className="flex items-center gap-2 text-xs text-brand-charcoal bg-amber-50/80 border border-amber-200 p-3.5 rounded-xl">
          <Truck size={16} className="text-amber-700 shrink-0" />
          <span>
            <strong>Interstate Policy:</strong> Shipments outside Lagos are securely routed via GIG Logistics with full waybill tracking.
          </span>
        </div>
      )}

      {/* Transit Safety Badge */}
      <div className="flex items-center gap-2 text-xs text-brand-graphite bg-brand-stone/20 p-3 rounded-xl border border-brand-stone">
        <ShieldCheck size={16} className="text-brand-champagne shrink-0" />
        <span>
          Every SN24 order is packaged in tamper-proof luxury protective packaging with courier confirmation.
        </span>
      </div>
    </div>
  );
}
