import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type PortfolioUIContextValue = {
  activePortfolio: number;
  setActivePortfolio: (portfolioId: number) => void;
};

const PortfolioUIContext = createContext<PortfolioUIContextValue | undefined>(
  undefined,
);

export const PortfolioUIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activePortfolio, setActivePortfolioState] = useState<number>(1);

  const setActivePortfolio = useCallback((portfolioId: number) => {
    setActivePortfolioState(portfolioId);
  }, []);

  const value = useMemo(
    () => ({
      activePortfolio,
      setActivePortfolio,
    }),
    [activePortfolio, setActivePortfolio],
  );

  return (
    <PortfolioUIContext.Provider value={value}>
      {children}
    </PortfolioUIContext.Provider>
  );
};

export const usePortfolioUI = () => {
  const ctx = useContext(PortfolioUIContext);
  if (!ctx)
    throw new Error("usePortfolioUI must be inside PortfolioUIProvider");
  return ctx;
};
