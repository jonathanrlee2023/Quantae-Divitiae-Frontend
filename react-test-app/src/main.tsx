import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
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

  if (!userId) {
    return (
      <>
        {/* Render the filter here so Login/Register can see it */}
        <MetalFilter />
        {showLanding ? (
          <LandingPage onLoginClick={() => setShowLanding(false)} />
        ) : (
          <>
            {isRegistering ? (
              <Register
                onBackToLogin={() => setIsRegistering(false)}
                onLogin={(id) => setUserId(id)}
              />
            ) : (
              <Login
                onLogin={(id) => setUserId(id)}
                onGoToRegister={() => setIsRegistering(true)}
                onBackToLanding={() => {
                  setIsRegistering(false);
                  setShowLanding(true);
                }}
              />
            )}
          </>
        )}
      </>
    );
  }

  // Once logged in, render the app with all Contexts
  return (
    <ButtonsProvider>
      <StockProvider>
        <OptionProvider>
          <BalanceProvider>
            <CompanyProvider>
              <StreamActionsProvider>
                <WSProvider clientID={`STOCK_CLIENT_${userId}`}>
                  <MetalFilter />
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
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />,
);
