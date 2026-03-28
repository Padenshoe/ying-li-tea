import { createContext, useContext, useState, ReactNode } from "react";

export type Currency = "USD" | "TWD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: number; // 1 USD = exchangeRate TWD
  convertPrice: (priceInUSD: number) => number;
  formatPrice: (price: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Approximate exchange rate (you can update this or fetch from API)
const USD_TO_TWD_RATE = 32;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  const convertPrice = (priceInUSD: number): number => {
    if (currency === "TWD") {
      return Math.round(priceInUSD * USD_TO_TWD_RATE * 100) / 100;
    }
    return priceInUSD;
  };

  const formatPrice = (price: number): string => {
    if (currency === "USD") {
      return `$${price.toFixed(2)}`;
    } else {
      return `NT$${price.toFixed(0)}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate: USD_TO_TWD_RATE,
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
