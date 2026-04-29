// components/MetalText.tsx
import React from "react";
import { COLORS } from "../constants/Colors";

interface MetalTextProps {
  children: React.ReactNode;
  color?: string;
  fontSize?: string;
  className?: string;
}

export const MetalText: React.FC<MetalTextProps> = ({
  children,
  color = COLORS.yellow.button,
  fontSize = "1rem",
  className = "",
}) => {
  return (
    <span
      className={className}
      style={{
        filter: "url(#recessed-metal)", // The magic link
        color: color,
        fontSize: fontSize,
        fontFamily: "monospace",
        fontWeight: "bold",
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
};
