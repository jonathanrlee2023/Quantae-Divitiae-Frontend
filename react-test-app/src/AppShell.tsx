import React, { useMemo } from "react";
import { useAuth, useUser } from "@clerk/react";
import App from "./App";
import { ButtonsProvider } from "./components/shared/ButtonContext";
import { StockProvider } from "./components/contexts/StockContext";
import { BalanceProvider } from "./components/contexts/BalanceContext";
import { OptionProvider } from "./components/contexts/OptionContext";
import { CompanyProvider } from "./components/contexts/CompanyContext";
import { StreamActionsProvider } from "./components/contexts/StreamActionsContext";
import { WSProvider } from "./components/contexts/WSContext";
import LandingPage from "./pages/LandingPage";
import { MetalFilter } from "./components/shared/MetalFilter";
import { RouteTransition } from "./components/shared/RouteTransition";
import { NavigationProvider } from "./state/NavigationContext";
import { SelectionProvider } from "./state/SelectionContext";
import { PortfolioUIProvider } from "./state/PortfolioUIContext";
import { ClerkTokenBridge } from "./components/auth/ClerkTokenBridge";

function clerkClientId(userId: string) {
  const safe = userId.replace(/[^a-zA-Z0-9]/g, "_");
  return `STOCK_CLIENT_${safe}`;
}

const AppShell = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const screenKey = !isLoaded ? "loading" : isSignedIn ? "app" : "landing";

  const screens = useMemo(
    () => ({
      loading: (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <span style={{ color: "#888", letterSpacing: "0.1em" }}>Loading…</span>
        </div>
      ),
      landing: <LandingPage />,
      app:
        isSignedIn && user ? (
          <ClerkTokenBridge>
            <ButtonsProvider>
              <StockProvider>
                <OptionProvider>
                  <BalanceProvider>
                    <CompanyProvider>
                      <StreamActionsProvider>
                        <WSProvider clientID={clerkClientId(user.id)}>
                          <NavigationProvider>
                            <SelectionProvider>
                              <PortfolioUIProvider>
                                <App />
                              </PortfolioUIProvider>
                            </SelectionProvider>
                          </NavigationProvider>
                        </WSProvider>
                      </StreamActionsProvider>
                    </CompanyProvider>
                  </BalanceProvider>
                </OptionProvider>
              </StockProvider>
            </ButtonsProvider>
          </ClerkTokenBridge>
        ) : null,
    }),
    [isSignedIn, user],
  );

  return (
    <>
      <MetalFilter />
      <RouteTransition
        screenKey={screenKey}
        screens={screens}
        className={screenKey === "app" ? "route-transition-shell--app" : ""}
      />
    </>
  );
};

export default AppShell;
