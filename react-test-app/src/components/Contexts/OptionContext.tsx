import { createContext, useCallback, useContext, useState } from "react";
import { HistoricalStockPoint, StockPoint } from "./StockContext";

export type OptionPoint = {
  Symbol: string; // Capitalized in JSON
  Mark: number; // Capitalized in JSON
  HighPrice: number;
  LastPrice: number;
  AskPrice: number;
  BidPrice: number;
  timestamp: number; // Lowercase in JSON
  IV: number; // Double-check Go tags for these
  Delta: number;
  Gamma: number;
  Theta: number;
  Vega: number;
};

export type InitialCompanyData = {
  Call: string[];
  Put: string[];
  PriceHistory: HistoricalStockPoint[];
  Quote: StockPoint;
  News: Record<string, string>;
};
interface OptionContextValue {
  optionPoints: Record<string, OptionPoint[]>;
  optionExpirations: Record<string, InitialCompanyData>;
  updateOptionPoint: (symbol: string, point: OptionPoint) => void;
  updateOptionExpirations: (symbol: string, exp: InitialCompanyData) => void;
}

const OptionContext = createContext<OptionContextValue | undefined>(undefined);

export const OptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [optionPoints, setOptionPoints] = useState<
    Record<string, OptionPoint[]>
  >({});
  const [optionExpirations, setOptionExpirations] = useState<
    Record<string, InitialCompanyData>
  >({});

  const updateOptionPoint = useCallback(
    (symbol: string, point: OptionPoint) => {
      setOptionPoints((prev) => {
        const existing = prev[symbol] || [];
        const next =
          existing.length >= 1920
            ? [...existing.slice(1), point]
            : [...existing, point];
        return { ...prev, [symbol]: next };
      });
    },
    [],
  );

  const updateOptionExpirations = useCallback(
    (symbol: string, exp: InitialCompanyData) => {
      setOptionExpirations((prev) => ({
        ...prev,
        [symbol]: exp,
      }));
    },
    [],
  );

  return (
    <OptionContext.Provider
      value={{
        optionPoints,
        optionExpirations,
        updateOptionPoint,
        updateOptionExpirations,
      }}
    >
      {children}
    </OptionContext.Provider>
  );
};

export const useOptionContext = () => {
  const ctx = useContext(OptionContext);
  if (!ctx) throw new Error("useOptionContext must be inside OptionProvider");
  return ctx;
};
