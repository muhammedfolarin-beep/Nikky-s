"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getStoreSettings } from "@/lib/actions";

type CurrencyContextType = {
  currency: string;
  exchangeRate: number;
  formatPrice: (amount: number) => string;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initCurrency() {
      try {
        // 1. Fetch store settings for target currency
        const settings = await getStoreSettings();
        const targetCurrency = settings?.currency || "USD";
        setCurrency(targetCurrency);

        // 2. If target is not USD, fetch the exchange rate
        if (targetCurrency !== "USD") {
          const res = await fetch("https://open.er-api.com/v6/latest/USD");
          if (res.ok) {
            const data = await res.json();
            if (data.rates && data.rates[targetCurrency]) {
              setExchangeRate(data.rates[targetCurrency]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize currency", error);
      } finally {
        setIsLoading(false);
      }
    }

    initCurrency();
  }, []);

  const formatPrice = (amount: number) => {
    const convertedAmount = amount * exchangeRate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(convertedAmount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, exchangeRate, formatPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
