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
import { ClosePosition } from "../contexts/BalanceContext";

interface ClosedPositionCardProps {
  defaultMessage: string;
}

export const ClosedPositionCard: React.FC<ClosedPositionCardProps> = ({
  defaultMessage,
}) => {
  const { activePortfolio } = usePortfolioUI();
  console.log("activePortfolio", activePortfolio);
  const { closePositions } = useWS();
  console.log("closePositions", closePositions);
  console.log("closePositions?.ClosePositions", closePositions?.ClosePositions);
  const closePositionsForPortfolioRaw =
    closePositions?.ClosePositions?.[activePortfolio] ?? [];
  console.log("closePositionsForPortfolioRaw", closePositionsForPortfolioRaw);
  const closePositionsForPortfolio: ClosePosition[] = Array.isArray(
    closePositionsForPortfolioRaw,
  )
    ? closePositionsForPortfolioRaw
    : [];
  console.log("closePositionsForPortfolio", closePositionsForPortfolio);
  const previousClosePositionsForPortfolioRef = useRef<ClosePosition[]>([]);

  useEffect(() => {
    previousClosePositionsForPortfolioRef.current = closePositionsForPortfolio;
  }, [closePositionsForPortfolio]);

  const priceColor = (id: string): string => {
    const list = closePositions?.ClosePositions?.[activePortfolio] ?? [];
    const closePosition = Array.isArray(list)
      ? list.find((position) => position.id === id)
      : undefined;
    if (!closePosition) return COLORS.mainFontColor;
    if (closePosition.pl > 0) return COLORS.green.positive;
    if (closePosition.pl < 0) return COLORS.red.negative;
    return COLORS.mainFontColor;
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
        backgroundColor: COLORS.appBackground,
      }}
    >
      {closePositionsForPortfolio.length === 0 ? (
        <div
          style={{
            color: COLORS.neutrals.n444,
            padding: "24px",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          {defaultMessage}
        </div>
      ) : (
        <>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 20,
              padding: "8px 16px",
              backgroundColor: COLORS.appBackground,
              borderBottom: "1px solid " + COLORS.dynamic.bottomBorder,
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              alignItems: "center",
              fontSize: "0.65rem",
              color: COLORS.neutrals.n444,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            <span>Ticker / ID</span>
            <span style={{ textAlign: "center" }}>Price</span>
            <span style={{ textAlign: "center" }}>P/L</span>
            <span style={{ textAlign: "center" }}>Timestamp</span>
          </div>

          {closePositionsForPortfolio.map((closePosition) => (
            <div
              key={closePosition.id}
              style={{
                padding: "12px 16px",
                cursor: "pointer",
                backgroundColor: COLORS.dynamic.background,
                borderBottom: "1px solid " + COLORS.dynamic.bottomBorder,
                position: "relative",
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
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    color: COLORS.mainFontColor,
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatDisplayId(closePosition.id)}
                </span>

                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    color: priceColor(closePosition.id),
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  ${closePosition.price}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    color: priceColor(closePosition.id),
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  ${closePosition.pl}
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    color: priceColor(closePosition.id),
                    fontFamily: "monospace",
                    textAlign: "center",
                  }}
                >
                  {new Date(closePosition.timestamp * 1000).toLocaleString()}
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
                {isOption(closePosition.id) ? "CONTRACTS" : "SHARES"}:{" "}
                {closePosition.amount}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
