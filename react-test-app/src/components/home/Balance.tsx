import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { useWSData } from "../contexts/WSContext";
import "chartjs-adapter-date-fns";
import { BalancePoint, useBalanceContext } from "../contexts/BalanceContext";
import { verticalLinePlugin } from "../stocks/TodayGraph";
import { COLORS } from "../../constants/Colors";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface BalanceWSProps {
  activePortfolio: number;
}

type BalanceTimeframe = "Live" | "1W" | "1M" | "3M" | "1Y" | "3Y" | "All";

const TIMEFRAME_CUTOFFS_SEC: Record<
  Exclude<BalanceTimeframe, "Live" | "All">,
  number
> = {
  "1W": 7 * 86400,
  "1M": 30 * 86400,
  "3M": 90 * 86400,
  "1Y": 365 * 86400,
  "3Y": 365 * 3 * 86400,
};

export const BalanceWSComponent: React.FC<BalanceWSProps> = ({
  activePortfolio,
}) => {
  const { balancePoints, historicalBalancePoints } = useBalanceContext();
  const { previousBalance } = useWSData();
  const [timeframe, setTimeframe] = useState<BalanceTimeframe>("Live");

  const previousPortfolioBalance = previousBalance[activePortfolio] || 0;
  const liveHistory = balancePoints[activePortfolio] || [];
  const eodHistory = historicalBalancePoints[activePortfolio] || [];

  const latestBalance =
    liveHistory.length > 0
      ? liveHistory[liveHistory.length - 1].Balance
      : eodHistory.length > 0
        ? eodHistory[eodHistory.length - 1].Balance
        : 0;

  const latestCash =
    liveHistory.length > 0
      ? liveHistory[liveHistory.length - 1].Cash
      : eodHistory.length > 0
        ? eodHistory[eodHistory.length - 1].Cash
        : 0;

  const graphData = React.useMemo(() => {
    let displayPoints: BalancePoint[] = [];

    if (timeframe === "Live") {
      const minutePoints = new Map<number, BalancePoint>();
      for (const p of liveHistory) {
        const minuteKey = Math.floor((p.timestamp - 15) / 60);
        const pointTime = new Date(p.timestamp * 1000);
        const now = new Date();
        const pointMinute = new Date(
          pointTime.getFullYear(),
          pointTime.getMonth(),
          pointTime.getDate(),
          pointTime.getHours(),
          pointTime.getMinutes(),
        ).getTime();
        const currentMinute = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          now.getHours(),
          now.getMinutes(),
        ).getTime();

        if (pointMinute <= currentMinute) {
          minutePoints.set(minuteKey, p);
        }
      }
      displayPoints = Array.from(minutePoints.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([, point]) => point);
    } else {
      displayPoints = [...eodHistory];
      if (timeframe !== "All") {
        const nowSec = Math.floor(Date.now() / 1000);
        const minTimestamp = nowSec - TIMEFRAME_CUTOFFS_SEC[timeframe];
        displayPoints = displayPoints.filter(
          (p) => p.timestamp >= minTimestamp,
        );
      }
    }

    const xValues = displayPoints.map((p) => new Date(p.timestamp * 1000));
    const minX = xValues[0] ?? new Date();
    const maxX = xValues[xValues.length - 1] ?? new Date();
    const lastPoint = displayPoints[displayPoints.length - 1];
    const balanceLineColor =
      lastPoint && lastPoint.Balance < previousPortfolioBalance
        ? COLORS.red.negative
        : COLORS.green.positive;

    return {
      datasets: [
        {
          label: "Balance",
          data: displayPoints.map((p) => ({
            x: new Date(p.timestamp * 1000),
            y: p.Balance,
            cash: p.Cash,
          })),
          fill: false,
          borderColor: balanceLineColor,
          tension: timeframe === "Live" ? 0 : 0.1,
          pointRadius: timeframe === "Live" ? 2 : 0,
        },
        {
          label: "Previous Balance",
          data: [
            { x: minX, y: previousPortfolioBalance },
            { x: maxX, y: previousPortfolioBalance },
          ],
          borderColor: COLORS.status.errorBorder,
          borderWidth: 1,
          pointRadius: 0,
          borderDash: [5, 5],
        },
      ],
    };
  }, [
    liveHistory,
    eodHistory,
    timeframe,
    previousPortfolioBalance,
    activePortfolio,
  ]);

  const options = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: COLORS.cardBackground,
          titleFont: {
            family: "monospace",
            size: 12,
            weight: "bold" as const,
          },
          bodyFont: {
            family: "monospace",
            size: 12,
          },
          borderColor: COLORS.cardSoftBorder,
          borderWidth: 1,
          cornerRadius: 0,
          displayColors: false,
          padding: 10,
          callbacks: {
            label: (ctx: TooltipItem<"line">) => {
              if (ctx.dataset.label === "Previous Balance") {
                return `Prev: $${ctx.parsed.y.toFixed(2)}`;
              }
              const raw = ctx.raw as { cash?: number };
              const lines = [`Balance: $${ctx.parsed.y.toFixed(2)}`];
              if (typeof raw.cash === "number") {
                lines.push(`Cash: $${raw.cash.toFixed(2)}`);
              }
              return lines;
            },
          },
        },
      },
      layout: {
        padding: { top: 10, bottom: 0 },
      },
      scales: {
        x: {
          type: "time" as const,
          time: {
            tooltipFormat: timeframe === "Live" ? "HH:mm:ss" : "MMM d, yyyy",
            unit: timeframe === "Live" ? ("minute" as const) : ("day" as const),
            displayFormats: {
              minute: "HH:mm",
              hour: "HH:mm",
              day: "MM/dd",
              month: "MMM yy",
            },
          },
          grid: {
            color: COLORS.cardSoftBorder,
            borderColor: COLORS.cardSoftBorder,
          },
          ticks: { maxTicksLimit: 6, font: { size: 10 } },
        },
        y: {
          grid: {
            color: COLORS.cardSoftBorder,
            borderColor: COLORS.cardSoftBorder,
          },
          ticks: {
            font: { size: 10 },
            callback: (value: number | string) =>
              typeof value === "number" ? `$${value.toFixed(2)}` : value,
          },
        },
      },
    }),
    [timeframe],
  );

  const balanceColor =
    latestBalance < previousPortfolioBalance
      ? COLORS.red.negative
      : COLORS.green.positive;

  const change = latestBalance - previousPortfolioBalance;
  const changePercent =
    previousPortfolioBalance !== 0
      ? (change / previousPortfolioBalance) * 100
      : 0;

  const eodSeries = historicalBalancePoints[activePortfolio] || [];
  const allLabel =
    eodSeries.length > 0
      ? new Date(eodSeries[0].timestamp * 1000).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
        })
      : "All";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "15px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            fontSize: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            letterSpacing: "0.05em",
          }}
        >
          <span style={{ color: COLORS.mainFontColor }}>
            TOTAL BALANCE:{" "}
            <span style={{ color: balanceColor, fontWeight: "bold" }}>
              $
              {latestBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </span>
          <span style={{ color: COLORS.mainFontColor }}>
            CASH:{" "}
            <span style={{ color: COLORS.mainFontColor, fontWeight: "bold" }}>
              $
              {latestCash.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </span>
        </div>

        <div
          style={{
            color: balanceColor,
            fontSize: "12px",
            fontWeight: 900,
            fontFamily: "monospace",
          }}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)} | ({changePercent.toFixed(2)}%)
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <Line
          key={`${activePortfolio}-${timeframe}`}
          options={{
            ...options,
            maintainAspectRatio: false,
            responsive: true,
          }}
          data={graphData}
          plugins={[verticalLinePlugin]}
        />
      </div>

      <div
        className="d-flex flex-wrap gap-2 justify-content-center"
        style={{ flex: "0 0 auto", paddingTop: "10px" }}
      >
        {(["Live", "1W", "1M", "3M", "1Y", "3Y", "All"] as const).map((tf) => (
          <button
            key={tf}
            type="button"
            className={`btn btn-sm ${timeframe === tf ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setTimeframe(tf)}
            style={{
              minWidth: "60px",
              fontSize: "0.7rem",
              letterSpacing: "0.05em",
              fontWeight: timeframe === tf ? "bold" : "normal",
              textTransform: "uppercase",
              border:
                timeframe === tf
                  ? "none"
                  : `1px solid ${COLORS.cardSoftBorder}`,
              backgroundColor:
                timeframe === tf
                  ? COLORS.secondaryTextColor
                  : COLORS.transparent,
            }}
          >
            {tf === "All" ? allLabel : tf}
          </button>
        ))}
      </div>
    </div>
  );
};
