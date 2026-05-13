import React, { useEffect, useRef, useState } from "react";
import { useWS } from "../contexts/WSContext";
import { useStockContext } from "../contexts/StockContext";
import { useOptionContext } from "../contexts/OptionContext";
import { useStreamActionsContext } from "../contexts/StreamActionsContext";
import { COLORS } from "../../constants/Colors";
import { ParseOptionId } from "../shared/BackendCom";
import { useNavigation } from "../../state/NavigationContext";
import { useSelection } from "../../state/SelectionContext";
import { usePortfolioUI } from "../../state/PortfolioUIContext";

interface IdCardProps {
  defaultMessage: string;
}

export const IdCards: React.FC<IdCardProps> = ({ defaultMessage }) => {
  const { goTo: setActiveCard } = useNavigation();
  const { setFixedID: setActiveID, setActiveStock } = useSelection();
  const { activePortfolio } = usePortfolioUI();
  const { ids, setPreviousID, clientID } = useWS();
  const portfolioIds = ids[activePortfolio] ?? {};
  const previousIdsRef = useRef<Record<string, number>>({});
  const { stockPoints, historicalStockPoints } = useStockContext();
  const { optionPoints } = useOptionContext();
  const { startStockStream, startOptionStream } = useStreamActionsContext();
  useEffect(() => {
    previousIdsRef.current = portfolioIds; // just track the latest ids
  }, [ids]);

  const handleCardClick = (id: string) => {
    if (id.length > 6) {
      const optionParts = ParseOptionId(id);

      if (optionParts) {
        startOptionStream(
          optionParts.ticker,
          optionParts.strike,
          optionParts.day,
          optionParts.month,
          optionParts.year,
          optionParts.type,
          clientID,
        );
        setActiveCard("fixedOption");
        setActiveID(id);
      } else {
        console.error("Failed to parse option ID:", id);
        return; // Exit early if parsing fails
      }
    } else {
      startStockStream(id, clientID, "Yes");
      setPreviousID(id);
      setActiveCard("fixedStock");
      setActiveStock(id);
    }
  };
  const getLatestPrice = (id: string): string => {
    if (id.length > 6) {
      const points = optionPoints[id];
      if (!points || points.length === 0) {
        return "Loading...";
      }
      const latestPoint = points.at(-1);
      return latestPoint ? `$${latestPoint.Mark.toFixed(2)}` : "N/A";
    } else {
      const points = stockPoints[id];
      if (!points || points.length === 0) {
        return "Loading...";
      }
      const latestPoint = points.at(-1);
      return latestPoint ? `$${latestPoint.Mark.toFixed(2)}` : "N/A";
    }
  };

  const priceColor = (id: string): string => {
    const points = id.length > 6 ? optionPoints[id] : stockPoints[id];
    if (!points || points.length < 2) return COLORS.mainFontColor; // Default color
    const latest = points.at(-1)?.Mark || 0;
    const previous = historicalStockPoints[id]?.at(-1)?.close || 0;
    if (latest > previous) return COLORS.green.positive;
    if (latest < previous) return COLORS.red.negative;
    return COLORS.mainFontColor; // Default color
  };

  const formatDisplayId = (id: string): string => {
    const parts = ParseOptionId(id);
    if (!parts) return id; // plain stock, show as-is

    const typeFull = parts.type === "C" ? "Call" : "Put";
    const fullYear = `20${parts.year}`;
    return `${parts.ticker} $${parts.strike} ${typeFull} ${parts.month}/${parts.day}/${fullYear}`;
  };

  const isOption = (id: string): boolean => ParseOptionId(id) !== null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        padding: "0",
        maxHeight: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: COLORS.appBackground,
      }}
    >
      {Object.keys(portfolioIds).length === 0 ? (
        <div
          style={{
            color: COLORS.neutrals.n444,
            padding: "24px",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "12px",
            }}
          >
            {defaultMessage}
          </div>
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn-sleek btn-sleek-dark"
              style={{ fontSize: "0.65rem", height: "30px", padding: "0 10px" }}
              onClick={() => setActiveCard("stock")}
            >
              BROWSE STOCKS
            </button>
            <button
              type="button"
              className="btn-sleek"
              style={{
                fontSize: "0.65rem",
                height: "30px",
                padding: "0 10px",
                backgroundColor: COLORS.secondaryTextColor,
                color: COLORS.appBackground,
              }}
              onClick={() => setActiveCard("portfolioList")}
            >
              OPEN PORTFOLIOS
            </button>
          </div>
        </div>
      ) : (
        Object.entries(portfolioIds).map(([id, amount]) => (
          <div
            key={id}
            className="position-row"
            onClick={() => handleCardClick(id)}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              backgroundColor: COLORS.dynamic.background,
              borderBottom: "1px solid " + COLORS.dynamic.bottomBorder,
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.dynamic.hover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                COLORS.dynamic.background)
            }
          >
            {/* Ticker / ID Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2px",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "800",
                  color: COLORS.mainFontColor /* Brighter for readability */,
                  fontFamily: "monospace",
                  flex: 1,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDisplayId(id)}
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  color: priceColor(id) /* Accent color for price */,
                  fontFamily: "monospace",
                  flexShrink: 0,
                }}
              >
                {getLatestPrice(id)}
              </span>
            </div>

            {/* Holdings Info Row */}
            <div
              style={{
                fontSize: "0.7rem",
                color: COLORS.infoTextColor,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {isOption(id) ? "CONTRACTS" : "SHARES"}: {amount.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
