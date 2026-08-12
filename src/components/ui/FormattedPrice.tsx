"use client";

import { useCurrency } from "@/context/CurrencyContext";

export default function FormattedPrice({ amount }: { amount: number }) {
  const { formatPrice, isLoading } = useCurrency();
  
  if (isLoading) return <span className="opacity-50">...</span>;
  
  return <>{formatPrice(amount)}</>;
}
