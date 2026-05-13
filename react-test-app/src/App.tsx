import "bootstrap/dist/css/bootstrap.min.css";
import { Position } from "./components/contexts/StreamActionsContext";
import React, { useEffect, useState } from "react";
import "../App.css";
import OptionCard from "./components/options/OptionCard";
import HomePage from "./components/home/HomePage";
import StockCard from "./components/stocks/StockCard";
import FixedOptionCard from "./components/options/FixedOptionCard";
import FixedStockCard from "./components/stocks/FixedStockCard";
import { FinancialsCard } from "./components/company/FinancialsCard";
import { PortfolioCards } from "./components/portfolio/PortfoliosListCard";
import { NewPortfolioCard } from "./components/portfolio/NewPortfolioCard";
import StockToPortfolioCard from "./components/stocks/StockToPortfolioCard";
import { COLORS } from "./constants/Colors";
import { MetalText } from "./components/shared/MetalText";
import NewsTicker from "./components/shared/ScrollingNews";
import { useWSData } from "./components/contexts/WSContext";
import { useStockContext } from "./components/contexts/StockContext";
import { BacktestSelection } from "./components/backtest/BacktestSelection";
import BacktestGraphComponent from "./components/backtest/BacktestGraph";
import BacktestStockCard from "./components/backtest/BacktestStockCard";
import { useNavigation } from "./state/NavigationContext";
import { useSelection } from "./state/SelectionContext";
import { ClosedPositionCard } from "./components/portfolio/ClosedPositionCard";
import SettingsCard from "./components/settings/SettingsCard";

interface AppProps {
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  const { previousID } = useWSData();
  const { backtestPayload } = useStockContext();
  const { activeCard, goTo: setActiveCard } = useNavigation();
  const { activeStock, setActiveStock } = useSelection();
  const [newStocks, setNewStocks] = useState<Record<string, Position>>({});
  const [weights, setWeights] = useState<Record<string, number>>({ Cash: 1.0 });
  const [tempPortfolioName, setTempPortfolioName] = useState<string>("");
  const [displayedCard, setDisplayedCard] = useState<string>("home");
  const [isCardTransitioning, setIsCardTransitioning] =
    useState<boolean>(false);
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null);

  useEffect(() => {
    if (previousID && !activeStock) setActiveStock(previousID);
  }, [previousID, activeStock, setActiveStock]);

  useEffect(() => {
    if (activeCard === displayedCard) return;

    setIsCardTransitioning(true);
    const swapTimer = window.setTimeout(() => {
      setDisplayedCard(activeCard);
      setIsCardTransitioning(false);
    }, 120);

    return () => {
      window.clearTimeout(swapTimer);
    };
  }, [activeCard, displayedCard]);

  const isNavItemActive = (itemId: string) => {
    if (itemId === "backtestSelection") {
      return (
        activeCard === "backtestSelection" ||
        activeCard === "backtestGraph" ||
        activeCard === "backtestStock"
      );
    }
    return activeCard === itemId;
  };

  return (
    <div
      className="container-fluid p-0 main-app-shell"
      style={{
        backgroundColor: COLORS.cardBackground,
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* 1. PERSISTENT HEADER */}
      <div
        className="d-flex align-items-center main-app-header"
        style={{
          height: "50px",
          borderBottom: "1px solid " + COLORS.headerBottomBorder,
          padding: "0 20px",
          flexShrink: 0,
          position: "relative", // Needed for absolute centering
        }}
      >
        {/* LEFT: Logo */}
        <div className="main-app-brand" style={{ flex: "0 0 200px" }}>
          {" "}
          {/* Fixed width keeps center stable */}
          <MetalText
            children="QUANTAE DIVITIAE"
            className="card-title mb-0"
            fontSize="1.2rem"
          />
        </div>

        {/* MIDDLE: The News Ticker */}
        <div
          className="main-app-news"
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            height: "100%",
            padding: "0 40px",
          }}
        >
          <NewsTicker />
        </div>

        {/* RIGHT: Navigation */}
        <nav
          className="d-flex gap-4 main-app-nav"
          style={{ height: "100%", flex: "0 0 auto" }}
        >
          {[
            { id: "home", label: "DASHBOARD" },
            { id: "stock", label: "STOCKS" },
            { id: "options", label: "OPTIONS" },
            { id: "portfolioList", label: "PORTFOLIOS" },
            { id: "backtestSelection", label: "BACKTEST" },
            { id: "closedPosition", label: "HISTORY" },
            { id: "settings", label: "SETTINGS" },
          ].map((item) => {
            const isActive = isNavItemActive(item.id);

            return (
              <button
                className="main-app-nav-btn"
                key={item.id}
                type="button"
                title={`Open ${item.label}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  if (item.id === "backtestSelection") {
                    if (backtestPayload && backtestPayload.User?.length > 0) {
                      setActiveCard("backtestGraph");
                    } else {
                      setActiveCard("backtestSelection");
                    }
                  } else {
                    setActiveCard(item.id);
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color:
                    isActive || hoveredNavId === item.id
                      ? COLORS.mainFontColor
                      : COLORS.infoTextColor,
                  border: "none",
                  background: "transparent",
                  borderBottom: isActive
                    ? "2px solid " + COLORS.secondaryTextColor
                    : `2px solid ${COLORS.transparent}`,
                  transition: "all 0.2s ease",
                  padding: "0 4px",
                  height: "100%",
                }}
                onMouseEnter={() => setHoveredNavId(item.id)}
                onMouseLeave={() => setHoveredNavId(null)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
      <div
        className="main-app-content"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "hidden" /* Keeps children like HomePage constrained */,
          opacity: isCardTransitioning ? 0 : 1,
          transform: isCardTransitioning ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 250ms ease, transform 300ms ease",
        }}
      >
        {displayedCard === "home" && <HomePage />}
        {displayedCard === "options" && <OptionCard />}
        {displayedCard === "stock" && <StockCard />}
        {displayedCard === "fixedStock" && <FixedStockCard />}
        {displayedCard === "fixedOption" && <FixedOptionCard />}
        {displayedCard === "financials" && <FinancialsCard />}
        {displayedCard === "portfolioList" && <PortfolioCards />}
        {displayedCard === "newPortfolio" && (
          <NewPortfolioCard
            setNewStocks={setNewStocks}
            setTempPortfolioName={setTempPortfolioName}
            newStocks={newStocks}
            tempPortfolioName={tempPortfolioName}
          />
        )}
        {displayedCard === "stockToPortfolio" && (
          <StockToPortfolioCard setNewStocks={setNewStocks} />
        )}
        {displayedCard === "backtestSelection" && (
          <BacktestSelection weights={weights} setWeights={setWeights} />
        )}
        {displayedCard === "backtestGraph" && <BacktestGraphComponent />}
        {displayedCard === "backtestStock" && (
          <BacktestStockCard setWeight={setWeights} weight={weights} />
        )}
        {displayedCard === "closedPosition" && (
          <ClosedPositionCard defaultMessage="No closed positions" />
        )}
        {displayedCard === "settings" && <SettingsCard onLogout={onLogout} />}
      </div>
    </div>
  );
};

export default App;
