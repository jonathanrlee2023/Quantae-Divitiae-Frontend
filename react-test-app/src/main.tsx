import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../App.css";
import "bootstrap/dist/css/bootstrap.css";
import { ButtonsProvider } from "./components/shared/ButtonContext";
import { StockProvider } from "./components/contexts/StockContext";
import { BalanceProvider } from "./components/contexts/BalanceContext";
import { OptionProvider } from "./components/contexts/OptionContext";
import { CompanyProvider } from "./components/contexts/CompanyContext";
import { StreamActionsProvider } from "./components/contexts/StreamActionsContext";
import { WSProvider } from "./components/contexts/WSContext";
import Login from "./pages/LoginPage";
import Register from "./pages/CreateLoginPage";
import LandingPage from "./pages/LandingPage";
import { MetalFilter } from "./components/shared/MetalFilter";
import { RouteTransition } from "./components/shared/RouteTransition";
import { NavigationProvider } from "./state/NavigationContext";
import { SelectionProvider } from "./state/SelectionContext";
import { PortfolioUIProvider } from "./state/PortfolioUIContext";
import { clearAccessToken } from "./auth/token";
import { logoutSession, refreshAccessToken } from "./api/client";

const Main = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const performLocalLogout = () => {
    clearAccessToken();
    setUserId(null);
    setIsRegistering(false);
    setShowLanding(false);
  };

  const handleLogout = () => {
    void logoutSession();
    performLocalLogout();
  };

  useEffect(() => {
    if (!userId) return;

    const refresh = async () => {
      try {
        await refreshAccessToken();
      } catch {
        void logoutSession();
        performLocalLogout();
      }
    };

    const refreshInterval = window.setInterval(
      () => void refresh(),
      15 * 60 * 1000,
    );

    return () => {
      window.clearInterval(refreshInterval);
    };
  }, [userId]);

  const screenKey = userId
    ? "app"
    : showLanding
      ? "landing"
      : isRegistering
        ? "register"
        : "login";

  const screens = useMemo(
    () => ({
      landing: <LandingPage onLoginClick={() => setShowLanding(false)} />,
      login: (
        <Login
          onLogin={(id) => setUserId(id)}
          onGoToRegister={() => setIsRegistering(true)}
          onBackToLanding={() => {
            setIsRegistering(false);
            setShowLanding(true);
          }}
        />
      ),
      register: (
        <Register
          onBackToLogin={() => setIsRegistering(false)}
          onLogin={(id) => setUserId(id)}
        />
      ),
      app:
        userId != null ? (
          <ButtonsProvider>
            <StockProvider>
              <OptionProvider>
                <BalanceProvider>
                  <CompanyProvider>
                    <StreamActionsProvider>
                      <WSProvider clientID={`STOCK_CLIENT_${userId}`}>
                        <NavigationProvider>
                          <SelectionProvider>
                            <PortfolioUIProvider>
                              <App onLogout={handleLogout} />
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
        ) : null,
    }),
    [userId],
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />,
);
