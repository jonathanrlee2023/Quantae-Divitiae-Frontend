import { useState } from "react";
import { COLORS } from "../../constants/Colors";
import { BalanceWSComponent } from "./Balance";
import { IdCards } from "../portfolio/OpenPositions";
import { SectorAllocation } from "./SectorAllocation";
import { usePortfolioUI } from "../../state/PortfolioUIContext";

export const HomePage: React.FC = () => {
  const { activePortfolio } = usePortfolioUI();
  const [view, setView] = useState<"balance" | "sector">("balance");
  return (
    <div
      className="main-view-shell"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: COLORS.appBackground,
        padding: "8px 16px 12px 16px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        className="main-view-grid"
        style={{ display: "flex", flex: 1, gap: "16px", overflow: "hidden" }}
      >
        {/* Left side - Chart Dashboard */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div
            className="card"
            style={{
              flex: 1,
              margin: "0",
              display: "flex",
              flexDirection: "column",
              background: COLORS.appBackground,
              border: "1px solid " + COLORS.cardSoftBorder,
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              className="home-view-toggle"
              style={{
                position: "absolute",
                right: "12px",
                top: "12px",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: COLORS.infoTextColor,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  fontWeight: 700,
                }}
              >
                VIEW
              </span>
              <button
                className="home-view-btn"
                type="button"
                onClick={() => setView("balance")}
                aria-pressed={view === "balance"}
                style={{
                  background: COLORS.overlays.black50,
                  border: `1px solid ${
                    view === "balance"
                      ? COLORS.secondaryTextColor
                      : COLORS.cardSoftBorder
                  }`,
                  color:
                    view === "balance"
                      ? COLORS.mainFontColor
                      : COLORS.infoTextColor,
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                BALANCE
              </button>
              <button
                className="home-view-btn"
                type="button"
                onClick={() => setView("sector")}
                aria-pressed={view === "sector"}
                style={{
                  background: COLORS.overlays.black50,
                  border: `1px solid ${
                    view === "sector"
                      ? COLORS.secondaryTextColor
                      : COLORS.cardSoftBorder
                  }`,
                  color:
                    view === "sector"
                      ? COLORS.mainFontColor
                      : COLORS.infoTextColor,
                  cursor: "pointer",
                  padding: "5px 10px",
                  fontSize: "0.72rem",
                  fontFamily: "monospace",
                  borderRadius: "3px",
                  letterSpacing: "0.05em",
                }}
              >
                SECTOR
              </button>
            </div>

            <div style={{ flex: 1, height: "100%", width: "100%" }}>
              {view === "balance" ? (
                <BalanceWSComponent activePortfolio={activePortfolio} />
              ) : (
                <SectorAllocation activePortfolio={activePortfolio} />
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                paddingBottom: "8px",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    view === "balance"
                      ? COLORS.secondaryTextColor
                      : COLORS.borderColor,
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    view === "sector"
                      ? COLORS.secondaryTextColor
                      : COLORS.borderColor,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right side - Sidebar */}
        <div
          className="main-sidebar"
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            className="card-title main-sidebar-title"
            style={{
              fontSize: "0.65rem",
              color: COLORS.secondaryTextColor,
              letterSpacing: "0.15em",
              marginBottom: "8px",
              paddingLeft: "2px",
            }}
          >
            MARKET POSITIONS
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              background: COLORS.cardBackground,
              border: "1px solid " + COLORS.cardSoftBorder,
              borderRadius: "8px",
            }}
          >
            <IdCards defaultMessage="NO OPEN POSITIONS" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
