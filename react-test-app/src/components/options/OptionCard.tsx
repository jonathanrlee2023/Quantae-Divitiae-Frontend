import React, { useState } from "react";

import { OptionWSComponent } from "./OptionGraph";
import { COLORS } from "../../constants/Colors";
import { useNavigation } from "../../state/NavigationContext";
import { usePortfolioUI } from "../../state/PortfolioUIContext";
import { useStreamActionsContext } from "../contexts/StreamActionsContext";
import { useWSActions } from "../contexts/WSContext";

export const OptionCard: React.FC = () => {
  const { goTo: setActiveCard } = useNavigation();
  const { activePortfolio } = usePortfolioUI();
  const { startOptionStream } = useStreamActionsContext();
  const [formValues, setFormValues] = useState({
    underlyingStock: "",
    strikePrice: "",
    optionDay: "",
    optionMonth: "",
    optionYear: "",
    optionType: "",
  });
  const [searchParams, setSearchParams] = useState(formValues);
  const { clientID } = useWSActions();
  const updateField = (field: keyof typeof formValues, value: string) => {
    const normalized =
      field === "underlyingStock" || field === "optionType"
        ? value.toUpperCase()
        : value;
    setFormValues((prev) => ({ ...prev, [field]: normalized }));
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextParams = {
      underlyingStock: formValues.underlyingStock.trim(),
      strikePrice: formValues.strikePrice.trim(),
      optionDay: formValues.optionDay.trim(),
      optionMonth: formValues.optionMonth.trim(),
      optionYear: formValues.optionYear.trim(),
      optionType: formValues.optionType.trim(),
    };
    setSearchParams(nextParams);
    await startOptionStream(
      nextParams.underlyingStock,
      nextParams.strikePrice,
      nextParams.optionDay,
      nextParams.optionMonth,
      nextParams.optionYear,
      nextParams.optionType,
      clientID,
    );
  };
  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    minWidth: 0,
    height: "34px",
    border: `1px solid ${COLORS.borderColor}`,
    borderRadius: "4px",
    backgroundColor: COLORS.cardBackground,
    color: COLORS.mainFontColor,
    fontSize: "0.75rem",
    padding: "0 10px",
  };

  return (
    <div
      className="options-terminal-wrapper main-view-shell"
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: COLORS.appBackground,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevents the main body from scrolling
      }}
    >
      <header
        className="d-flex align-items-center gap-3 p-2 main-control-panel"
        style={{
          borderBottom: "1px solid " + COLORS.cardSoftBorder,
          backgroundColor: COLORS.cardBackground,
          zIndex: 10,
        }}
      >
        <button
          className="btn-sleek btn-sleek-dark main-escape-btn"
          onClick={() => setActiveCard("home")}
          style={{
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            borderColor: COLORS.borderColor,
          }}
        >
          ← ESC
        </button>

        <form
          className="flex-grow-1 d-flex align-items-end gap-2 flex-wrap"
          onSubmit={handleSearch}
        >
          <div
            className="d-flex flex-column"
            style={{ flex: "2 1 120px", minWidth: 0 }}
          >
            <span style={{ fontSize: "0.58rem", color: COLORS.infoTextColor }}>
              TICKER
            </span>
            <input
              style={baseInputStyle}
              value={formValues.underlyingStock}
              onChange={(e) => updateField("underlyingStock", e.target.value)}
              placeholder="AAPL"
            />
          </div>

          <div
            className="d-flex flex-column"
            style={{ flex: "2 1 120px", minWidth: 0 }}
          >
            <span style={{ fontSize: "0.58rem", color: COLORS.infoTextColor }}>
              STRIKE
            </span>
            <input
              style={baseInputStyle}
              value={formValues.strikePrice}
              onChange={(e) => updateField("strikePrice", e.target.value)}
              placeholder="200"
            />
          </div>

          <div
            className="d-flex flex-column"
            style={{ flex: "1 1 78px", minWidth: 0 }}
          >
            <span style={{ fontSize: "0.58rem", color: COLORS.infoTextColor }}>
              DAY
            </span>
            <input
              style={baseInputStyle}
              value={formValues.optionDay}
              onChange={(e) => updateField("optionDay", e.target.value)}
              placeholder="DD"
            />
          </div>

          <div
            className="d-flex flex-column"
            style={{ flex: "1 1 86px", minWidth: 0 }}
          >
            <span style={{ fontSize: "0.58rem", color: COLORS.infoTextColor }}>
              MONTH
            </span>
            <input
              style={baseInputStyle}
              value={formValues.optionMonth}
              onChange={(e) => updateField("optionMonth", e.target.value)}
              placeholder="MM"
            />
          </div>

          <div
            className="d-flex flex-column"
            style={{ flex: "1 1 92px", minWidth: 0 }}
          >
            <span style={{ fontSize: "0.58rem", color: COLORS.infoTextColor }}>
              YEAR
            </span>
            <input
              style={baseInputStyle}
              value={formValues.optionYear}
              onChange={(e) => updateField("optionYear", e.target.value)}
              placeholder="YY"
            />
          </div>

          <div
            className="d-flex flex-column"
            style={{ flex: "2 1 130px", minWidth: 0 }}
          >
            <span style={{ fontSize: "0.58rem", color: COLORS.infoTextColor }}>
              TYPE
            </span>
            <input
              style={baseInputStyle}
              value={formValues.optionType}
              onChange={(e) => updateField("optionType", e.target.value)}
              placeholder="CALL / PUT"
            />
          </div>

          <button
            type="submit"
            className="btn-sleek btn-sleek-dark main-escape-btn"
            style={{ flex: "0 0 auto" }}
          >
            SEARCH
          </button>
        </form>
      </header>

      {/* --- Live Stream & Trading Engine Area --- */}
      <main
        className="flex-grow-1"
        style={{
          position: "relative",
          minHeight: 0, // Crucial for inner flex children to scroll/resize correctly
        }}
      >
        <OptionWSComponent
          stockSymbol={searchParams.underlyingStock}
          strikePrice={searchParams.strikePrice}
          year={searchParams.optionYear}
          month={searchParams.optionMonth}
          day={searchParams.optionDay}
          type={searchParams.optionType}
          activePortfolio={activePortfolio}
        />
      </main>
    </div>
  );
};

export default OptionCard;
