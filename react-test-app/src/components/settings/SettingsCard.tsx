import React from "react";
import { SignOutButton, UserButton } from "@clerk/react";
import { COLORS } from "../../constants/Colors";

export const SettingsCard: React.FC = () => {
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
          padding: "24px",
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
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <UserButton />
        </div>
        <SignOutButton>
          <button type="button" className="btn-sleek btn-sleek-red w-100">
            LOG OUT
          </button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default SettingsCard;
