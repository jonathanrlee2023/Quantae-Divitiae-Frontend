import "bootstrap/dist/css/bootstrap.min.css";
import { Position } from "./components/Contexts/StreamActionsContext";
import React, { useEffect, useState } from "react";
import "../App.css";
import OptionCard from "./components/OptionCard";
import HomePage from "./components/HomePage";
import StockCard from "./components/StockCard";
import FixedOptionCard from "./components/FixedOptionCard";
import FixedStockCard from "./components/FixedStockCard";
import { FinancialsCard } from "./components/FinancialsCard";
import { PortfolioCards } from "./components/PortfoliosListCard";
import { NewPortfolioCard } from "./components/NewPortfolioCard";
import StockToPortfolioCard from "./components/StockToPortfolioCard";
import { COLORS } from "./constants/Colors";
import { MetalText } from "./components/MetalText";
import NewsTicker from "./components/ScrollingNews";
import { useWSData } from "./components/Contexts/WSContext";
import { useStockContext } from "./components/Contexts/StockContext";
import { BacktestSelection } from "./components/BacktestSelection";
import BacktestGraphComponent from "./components/BacktestGraph";
import BacktestStockCard from "./components/BacktestStockCard";
import { useNavigation } from "./state/NavigationContext";
import { useSelection } from "./state/SelectionContext";
import { usePortfolioUI } from "./state/PortfolioUIContext";
const App: React.FC = () => {
  const { previousID } = useWSData();
  const { backtestPayload } = useStockContext();
  const { activeCard, goTo: setActiveCard } = useNavigation();
  const { activeStock, fixedID, setActiveStock, setFixedID } = useSelection();
  const { activePortfolio, setActivePortfolio } = usePortfolioUI();
  const [newStocks, setNewStocks] = useState<Record<string, Position>>({});
  const [weights, setWeights] = useState<Record<string, number>>({ Cash: 1.0 });
  const [tempPortfolioName, setTempPortfolioName] = useState<string>("");

  useEffect(() => {
    if (previousID && !activeStock) setActiveStock(previousID);
  }, [previousID, activeStock, setActiveStock]);

  return (
    <div
      className="container-fluid p-0"
      style={{
        backgroundColor: COLORS.cardBackground,
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* 1. PERSISTENT HEADER */}
      <div
        className="d-flex align-items-center" // Removed justify-content-between
        style={{
          height: "50px",
          borderBottom: "1px solid " + COLORS.headerBottomBorder,
          padding: "0 20px",
          flexShrink: 0,
          position: "relative", // Needed for absolute centering
        }}
      >
        {/* LEFT: Logo */}
        <div style={{ flex: "0 0 200px" }}>
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
          className="d-flex gap-4"
          style={{ height: "100%", flex: "0 0 auto" }}
        >
          {[
            { id: "home", label: "DASHBOARD" },
            { id: "stock", label: "STOCKS" },
            { id: "options", label: "OPTIONS" },
            { id: "portfolioList", label: "PORTFOLIOS" },
            { id: "backtestSelection", label: "BACKTEST" },
          ].map((item) => (
            <div
              key={item.id}
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
                  activeCard === item.id
                    ? COLORS.mainFontColor
                    : COLORS.infoTextColor,
                borderBottom:
                  activeCard === item.id
                    ? "2px solid " + COLORS.secondaryTextColor
                    : `2px solid ${COLORS.transparent}`,
                transition: "all 0.2s ease",
                padding: "0 4px",
                height: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.mainFontColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  activeCard === item.id
                    ? COLORS.mainFontColor
                    : COLORS.infoTextColor;
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          overflow: "hidden" /* Keeps children like HomePage constrained */,
        }}
      >
        {activeCard === "home" && <HomePage />}
        {activeCard === "options" && <OptionCard />}
        {activeCard === "stock" && <StockCard />}
        {activeCard === "fixedStock" && <FixedStockCard />}
        {activeCard === "fixedOption" && <FixedOptionCard />}
        {activeCard === "financials" && <FinancialsCard />}
        {activeCard === "portfolioList" && <PortfolioCards />}
        {activeCard === "newPortfolio" && (
          <NewPortfolioCard
            setNewStocks={setNewStocks}
            setTempPortfolioName={setTempPortfolioName}
            newStocks={newStocks}
            tempPortfolioName={tempPortfolioName}
          />
        )}
        {activeCard === "stockToPortfolio" && (
          <StockToPortfolioCard setNewStocks={setNewStocks} />
        )}
        {activeCard === "backtestSelection" && (
          <BacktestSelection weights={weights} setWeights={setWeights} />
        )}
        {activeCard === "backtestGraph" && <BacktestGraphComponent />}
        {activeCard === "backtestStock" && (
          <BacktestStockCard setWeight={setWeights} weight={weights} />
        )}
      </div>
    </div>
  );
};

export default App;
