import React, { useMemo } from "react";
import { useBalanceContext } from "./Contexts/BalanceContext";
import { useOptionContext } from "./Contexts/OptionContext";
import "./CustomCSS/NewsTicker.css";
import { COLORS } from "../constants/Colors";
import { useNavigation } from "../state/NavigationContext";
import { useSelection } from "../state/SelectionContext";

const NewsTicker: React.FC = () => {
  const { activeCard } = useNavigation();
  const { activeStock } = useSelection();
  const { news: globalNews } = useBalanceContext();
  const { optionExpirations } = useOptionContext();

  const displayNews = useMemo(() => {
    const allGlobal = globalNews["GlobalNews"]
      ? Object.entries(globalNews["GlobalNews"])
      : [];

    if (activeCard === "home" || !activeStock) {
      return allGlobal;
    }

    const filteredGlobal = allGlobal.filter(([headline]) =>
      headline.toUpperCase().includes(activeStock.toUpperCase()),
    );

    const staticNews = optionExpirations[activeStock]?.News || {};
    const staticEntries = Object.entries(staticNews);

    const combined = [...staticEntries, ...filteredGlobal];

    return combined.length > 0 ? combined : allGlobal;
  }, [globalNews, optionExpirations, activeCard, activeStock]);

  const dynamicDuration = useMemo(() => {
    const itemCount = displayNews.length;
    const baseSpeed = 10;
    return Math.max(itemCount * baseSpeed, 10);
  }, [displayNews]);

  if (displayNews.length === 0) {
    return (
      <div className="ticker-wrap">
        <div
          className="ticker__item mx-auto"
          style={{ opacity: 1, fontWeight: "bold", color: COLORS.white }}
        >
          SYSTEM_READY // NO_SIGNALS_
          {activeCard === "home" ? "GLOBAL" : activeStock}
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-wrap">
      <div
        className="ticker"
        style={
          {
            "--ticker-duration": `${dynamicDuration}s`,
          } as React.CSSProperties
        }
      >
        {[1, 2].map((loop) => (
          <div className="ticker__group" key={loop}>
            {displayNews.map(([headline, url], index) => {
              return (
                <button
                  key={`${loop}-${headline}-${index}`}
                  className="ticker__item"
                  onClick={() =>
                    window.open(url, "_blank", "noopener,noreferrer")
                  }
                >
                  {headline}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
