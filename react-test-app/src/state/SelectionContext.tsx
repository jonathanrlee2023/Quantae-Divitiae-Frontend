import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type SelectionContextValue = {
  activeStock: string;
  fixedID: string;
  setActiveStock: (symbol: string) => void;
  setFixedID: (id: string) => void;
};

const SelectionContext = createContext<SelectionContextValue | undefined>(
  undefined,
);

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeStock, setActiveStockState] = useState<string>("");
  const [fixedID, setFixedIDState] = useState<string>("");

  const setActiveStock = useCallback((symbol: string) => {
    setActiveStockState(symbol);
  }, []);

  const setFixedID = useCallback((id: string) => {
    setFixedIDState(id);
  }, []);

  const value = useMemo(
    () => ({
      activeStock,
      fixedID,
      setActiveStock,
      setFixedID,
    }),
    [activeStock, fixedID, setActiveStock, setFixedID],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be inside SelectionProvider");
  return ctx;
};
