import React from "react";
import { COLORS } from "../../constants/Colors";

interface SettingsCardProps {
  onLogout: () => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ onLogout }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: 0,
          background: COLORS.cardBackground,
          border: `1px solid ${COLORS.cardSoftBorder}`,
          borderRadius: "8px",
        }}
      >
        <div
          className="card-title"
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.12em",
            color: COLORS.secondaryTextColor,
            marginBottom: "18px",
          }}
        >
          ACCOUNT SETTINGS
        </div>
        <button className="btn-sleek btn-sleek-red w-100" onClick={onLogout}>
          LOG OUT
        </button>
      </div>
    </div>
  );
};

export default SettingsCard;
