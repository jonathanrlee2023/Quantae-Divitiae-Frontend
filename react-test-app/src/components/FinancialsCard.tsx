import React, { useState } from "react";
import {
  BalanceSheet,
  CashFlowStatement,
  CompanyStats,
  EarningsReport,
  IncomeStatement,
  useCompanyContext,
} from "./Contexts/CompanyContext";
import { FinancialGrid } from "./FinancialGrid";
import { COLORS } from "../constants/Colors";
import { useWSData } from "./Contexts/WSContest";
import { useNavigation } from "../state/NavigationContext";

type Period = "Annual" | "Quarterly";
type ReportType = "Income" | "Balance" | "Cash" | "Earnings";

type FinancialData =
  | IncomeStatement[]
  | BalanceSheet[]
  | CashFlowStatement[]
  | EarningsReport[];

const REPORT_MAP: Record<Period, Record<ReportType, keyof CompanyStats>> = {
  Annual: {
    Income: "AnnualIncome",
    Balance: "AnnualBalance",
    Cash: "AnnualCash",
    Earnings: "AnnualEarnings",
  },
  Quarterly: {
    Income: "QuarterlyIncome",
    Balance: "QuarterlyBalance",
    Cash: "QuarterlyCash",
    Earnings: "QuarterlyEarnings",
  },
};

const getActiveReport = (
  stats: CompanyStats,
  period: Period,
  type: ReportType,
): FinancialData => {
  const key = REPORT_MAP[period][type];
  return (stats[key] as FinancialData) ?? [];
};
export const FinancialsCard: React.FC = () => {
  const { goTo: setActiveCard } = useNavigation();
  const [period, setPeriod] = useState<Period>("Annual");
  const [reportType, setReportType] = useState<ReportType>("Income");
  const { companyStats } = useCompanyContext();
  const { previousID, previousCard } = useWSData();

  const stats = companyStats[previousID];
  const activeData = getActiveReport(stats, period, reportType);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "94%",
        backgroundColor: COLORS.appBackground,
        padding: "0 10px 10px 10px",
        marginTop: "10px",
      }}
    >
      {/* Integrated Header Section */}
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          background: COLORS.cardBackground,
          padding: "12px 20px",
          borderBottom: "1px solid" + COLORS.borderColor,
          borderRadius: "4px 4px 0 0",
        }}
      >
        {/* Left: Ticker & Status */}
        <div className="d-flex align-items-center gap-3">
          {previousCard && (
            <button
              className="btn-sleek"
              onClick={() => setActiveCard(previousCard)}
              style={{
                padding: "2px 8px",
                fontSize: "0.7rem",
                border: "1px solid" + COLORS.borderColor,
                background: COLORS.transparent,
              }}
            >
              ←
            </button>
          )}
          <h2
            className="mb-0 d-flex align-items-baseline gap-2"
            style={{ fontSize: "1.4rem" }}
          >
            <span
              style={{
                fontWeight: "800",
                letterSpacing: "-0.02em",
                color: COLORS.mainFontColor,
              }}
            >
              {stats.Symbol}
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                color: COLORS.infoTextColor,
                fontFamily: "monospace",
                textTransform: "uppercase",
              }}
            >
              {stats.Sector} // {stats.Industry}
            </span>
          </h2>
        </div>

        {/* Right: Integrated Toggles */}
        <div className="d-flex align-items-center gap-4">
          {/* Period Selector */}
          <div
            className="d-flex gap-1"
            style={{
              background: COLORS.cardBackground,
              padding: "2px",
              borderRadius: "4px",
              border: "1px solid" + COLORS.borderColor,
            }}
          >
            {["Annual", "Quarterly"].map((p) => (
              <span
                key={p}
                onClick={() => setPeriod(p as Period)}
                style={{
                  fontSize: "0.6rem",
                  padding: "4px 10px",
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "all 0.2s",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                  backgroundColor:
                    period === p ? COLORS.secondaryTextColor : COLORS.transparent,
                  color:
                    period === p ? COLORS.appBackground : COLORS.infoTextColor,
                }}
              >
                {p.toUpperCase()}
              </span>
            ))}
          </div>

          <div
            style={{
              width: "1px",
              height: "16px",
              background: COLORS.borderColor,
            }}
          />

          {/* Report Type Selector */}
          <div className="d-flex gap-4">
            {["Income", "Balance", "Cash", "Earnings"].map((r) => (
              <span
                key={r}
                onClick={() => setReportType(r as ReportType)}
                style={{
                  fontSize: "0.65rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.12em",
                  fontWeight: "bold",
                  color:
                    reportType === r
                      ? COLORS.mainFontColor
                      : COLORS.infoTextColor,
                  borderBottom:
                    reportType === r
                      ? "2px solid" + COLORS.secondaryTextColor
                      : `2px solid ${COLORS.transparent}`,
                  paddingBottom: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.mainFontColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    reportType === r
                      ? COLORS.mainFontColor
                      : COLORS.infoTextColor;
                }}
              >
                {r.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Report Container (Now a sibling to the header) */}
      <div
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{
          background: COLORS.cardBackground,
          border: "1px solid" + COLORS.cardSoftBorder,
          borderTop: "none", // Seamless connection to header
          borderRadius: "0 0 4px 4px",
        }}
      >
        <div className="flex-grow-1 overflow-auto custom-scrollbar">
          {activeData && activeData.length > 0 ? (
            <FinancialGrid data={activeData} type={reportType} />
          ) : (
            <div
              className="h-100 d-flex flex-column align-items-center justify-content-center text-muted"
              style={{
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
                opacity: 0.5,
              }}
            >
              <span style={{ marginBottom: "10px", fontWeight: "800" }}>
                NO_DATA_FOUND
              </span>
              <span style={{ fontSize: "0.6rem", fontFamily: "monospace" }}>
                UNABLE TO RETRIEVE {period.toUpperCase()}{" "}
                {reportType.toUpperCase()} FOR {stats.Symbol}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
