import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type NavigationContextValue = {
  activeCard: string;
  goTo: (cardId: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | undefined>(
  undefined,
);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeCard, setActiveCard] = useState<string>("home");

  const goTo = useCallback((cardId: string) => {
    setActiveCard(cardId);
  }, []);

  const value = useMemo(
    () => ({
      activeCard,
      goTo,
    }),
    [activeCard, goTo],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be inside NavigationProvider");
  return ctx;
};
