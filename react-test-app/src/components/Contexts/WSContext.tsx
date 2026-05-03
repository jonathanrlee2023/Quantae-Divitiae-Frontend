import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { getAccessToken } from "../../auth/token";
import {
  BalancePoint,
  ClosePosition,
  ClosePositionHistory,
  useBalanceContext,
} from "./BalanceContext";
import { CompanyStats, useCompanyContext } from "./CompanyContext";
import { OptionPoint, useOptionContext } from "./OptionContext";
import {
  HistoricalStockPoint,
  StockPoint,
  BacktestPayload,
  useStockContext,
} from "./StockContext";

interface WSActionsContextValue {
  sendMessage: (msg: any) => void;
  setIds: React.Dispatch<
    React.SetStateAction<Record<number, Record<string, number>>>
  >;
  setTrackers: React.Dispatch<React.SetStateAction<string[]>>;
  setPreviousCard: React.Dispatch<React.SetStateAction<string>>;
  setPreviousID: React.Dispatch<React.SetStateAction<string>>;
  setPortfolioNames: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  setClosePositions: React.Dispatch<React.SetStateAction<ClosePositionHistory>>;
  clientID: string;
}

interface WSDataContextValue {
  lastMessage: any | null;
  ids: Record<number, Record<string, number>>;
  trackers: string[];
  previousBalance: Record<number, number>;
  previousCard: string;
  previousID: string;
  portfolioNames: Record<number, string>;
  closePositions: ClosePositionHistory;
}

const WSActionsContext = createContext<WSActionsContextValue | undefined>(
  undefined,
);
const WSDataContext = createContext<WSDataContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
  clientID: string;
}

export const WSProvider = ({ children, clientID }: Props): JSX.Element => {
  const ws = useRef<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [ids, setIds] = useState<Record<number, Record<string, number>>>({});
  const [trackers, setTrackers] = useState<string[]>([]);
  const [previousBalance, setPreviousBalance] = useState<
    Record<number, number>
  >({});
  const [previousCard, setPreviousCard] = useState<string>("");
  const [previousID, setPreviousID] = useState<string>("");
  const [portfolioNames, setPortfolioNames] = useState<Record<number, string>>(
    {},
  );
  const [closePositions, setClosePositions] = useState<ClosePositionHistory>({
    ClosePositions: [],
  });

  const { updateBalancePoint, updateNews } = useBalanceContext();
  const { updateCompanyStats } = useCompanyContext();
  const { updateOptionExpirations, updateOptionPoint } = useOptionContext();
  const {
    updateStockPoint,
    updateHistoricalStockPoint,
    updateBacktestPayload,
  } = useStockContext();

  useEffect(() => {
    const token = getAccessToken();
    ws.current = new WebSocket(
      `ws://localhost:8080/connect?id=${clientID}&token=${encodeURIComponent(token ?? "")}`,
    );

    ws.current.onopen = () => {
      console.log(`Websocket connected ${clientID}`);
    };

    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setLastMessage(parsed);

      if (parsed.type === "TICKER_UPDATE") {
        if (parsed.stocks) {
          parsed.stocks.forEach((stk: StockPoint) => {
            updateStockPoint(stk.Symbol, stk);
          });
        }

        if (parsed.options) {
          parsed.options.forEach((opt: OptionPoint) => {
            updateOptionPoint(opt.Symbol, opt);
          });
        }
        return;
      }

      if (parsed.closePositions !== undefined) {
        setClosePositions({
          ClosePositions: parsed.closePositions as ClosePosition[],
        });
        return;
      }

      if (parsed.GlobalNews !== undefined) {
        updateNews(parsed);
        return;
      }

      if (parsed.Benchmark !== undefined) {
        updateBacktestPayload(parsed as BacktestPayload);
        return;
      }

      if (parsed.openIdList !== undefined && parsed.prevBalance !== undefined) {
        setIds(parsed.openIdList);
        setTrackers(parsed.trackerIdList ?? []);
        setPreviousBalance(parsed.prevBalance);
        setPortfolioNames(parsed.portfolioNames ?? {});
        return;
      }

      if (parsed.PortfolioID !== undefined || parsed.Balance !== undefined) {
        updateBalancePoint(parsed as BalancePoint);
        return;
      }

      if (parsed.MarketCap !== undefined) {
        updateCompanyStats(parsed.Symbol, parsed as CompanyStats);
        return;
      }

      if (parsed.Call !== undefined) {
        updateOptionExpirations(parsed.Symbol, {
          Call: parsed.Call,
          Put: parsed.Put,
          Quote: parsed.Quote,
          PriceHistory: parsed.PriceHistory,
          News: parsed.News,
        });
        updateHistoricalStockPoint(
          parsed.Symbol,
          parsed.PriceHistory as HistoricalStockPoint[],
        );
        updateStockPoint(parsed.Symbol, parsed.Quote as StockPoint);
      }

      // 3) Single object (e.g. balance or lone stock point)
      if (parsed.symbol) {
        updateStockPoint(parsed.symbol, {
          Symbol: parsed.symbol,
          Mark: parsed.Mark,
          BidPrice: parsed.BidPrice,
          AskPrice: parsed.AskPrice,
          LastPrice: parsed.LastPrice,
          timestamp: parsed.timestamp,
        });

        return;
      }

      // 4) Truly unexpected
      console.warn("Unhandled WS message:", parsed);
    };

    ws.current.onclose = () => {
      console.log("Websocket connection closed");
    };

    // Cleanup on unmount or clientID change
    return () => {
      ws.current?.close();
      ws.current = null;
    };
  }, [clientID]);

  const sendMessage = useCallback((msg: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  const actionsValue = useMemo(
    () => ({
      sendMessage,
      setIds,
      setTrackers,
      setPreviousCard,
      setPreviousID,
      setPortfolioNames,
      clientID,
      setClosePositions,
    }),
    [
      sendMessage,
      setIds,
      setTrackers,
      setPreviousCard,
      setPreviousID,
      setPortfolioNames,
      clientID,
      setClosePositions,
    ],
  );

  const dataValue = useMemo(
    () => ({
      lastMessage,
      ids,
      trackers,
      previousBalance,
      previousCard,
      previousID,
      portfolioNames,
      closePositions,
    }),
    [
      lastMessage,
      ids,
      trackers,
      previousBalance,
      previousCard,
      previousID,
      portfolioNames,
      closePositions,
    ],
  );

  return (
    <WSActionsContext.Provider value={actionsValue}>
      <WSDataContext.Provider value={dataValue}>
        {children}
      </WSDataContext.Provider>
    </WSActionsContext.Provider>
  );
};

export const useWS = () => {
  const actions = useWSActions();
  const data = useWSData();
  return { ...actions, ...data };
};

export const useWSActions = () => {
  const ctx = useContext(WSActionsContext);
  if (!ctx) throw new Error("useWSActions must be used within WSProvider");
  return ctx;
};

export const useWSData = () => {
  const ctx = useContext(WSDataContext);
  if (!ctx) throw new Error("useWSData must be used within WSProvider");
  return ctx;
};
