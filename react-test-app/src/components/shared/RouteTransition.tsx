import React, { useEffect, useState } from "react";

interface RouteTransitionProps {
  screenKey: string;
  screens: Record<string, React.ReactNode>;
  className?: string;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  screenKey,
  screens,
  className = "",
}) => {
  const [displayedKey, setDisplayedKey] = useState(screenKey);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (screenKey === displayedKey) return;

    setIsExiting(true);
    const swapTimer = window.setTimeout(() => {
      setDisplayedKey(screenKey);
      setIsExiting(false);
    }, 280);

    return () => window.clearTimeout(swapTimer);
  }, [screenKey, displayedKey]);

  return (
    <div className={`route-transition-shell ${className}`.trim()}>
      <div
        className={`route-transition-content${isExiting ? " route-transition-content--exiting" : ""}`}
      >
        {screens[displayedKey] ?? null}
      </div>
    </div>
  );
};
