import React, { useState, useEffect } from "react";
import { colors, borderRadius, fontSize } from "../theme/colors";

interface SettingsToggleButtonProps {
  isVisible: boolean;
  onClick: () => void;
  isDisabled: boolean;
}

export const SettingsToggleButton: React.FC<SettingsToggleButtonProps> = ({
  isVisible,
  onClick,
  isDisabled,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isVisible || isDisabled) {
      setIsHovered(false);
    }
  }, [isVisible, isDisabled]);

  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "70px",
        height: "40px",
        backgroundColor: isHovered
          ? colors.buttonBackgroundHover
          : colors.buttonBackground,
        border: `1px solid ${colors.borderPrimary}`,
        borderRadius: borderRadius.pill,
        color: isHovered ? colors.textHover : colors.textPrimary,
        cursor: "pointer",
        fontSize: fontSize.xlarge,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        transition: "all 0.2s ease",
        boxShadow: `0 2px 8px ${colors.shadowLight}`,
        pointerEvents: isDisabled ? "none" : "auto",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>⚙</span>
      <span>↑</span>
    </button>
  );
};
