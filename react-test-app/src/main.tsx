import React, { useState } from "react";
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
import { MetalFilter } from "./components/shared/MetalFilter";
import { NavigationProvider } from "./state/NavigationContext";
import { SelectionProvider } from "./state/SelectionContext";
import { PortfolioUIProvider } from "./state/PortfolioUIContext";

const Main = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!userId) {
    return (
      <>
        {/* Render the filter here so Login/Register can see it */}
        <MetalFilter />
        {isRegistering ? (
          <Register
            onBackToLogin={() => setIsRegistering(false)}
            onLogin={(id) => setUserId(id)}
          />
        ) : (
          <Login
            onLogin={(id) => setUserId(id)}
            onGoToRegister={() => setIsRegistering(true)}
          />
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
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />,
);
