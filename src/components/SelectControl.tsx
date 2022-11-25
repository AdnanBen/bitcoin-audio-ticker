import React from "react";
import { colors, spacing, fontSize, borderRadius } from "../theme/colors";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectControlProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export const SelectControl: React.FC<SelectControlProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}>
      <span style={{ color: colors.textPrimary, fontSize: fontSize.medium }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: borderRadius.medium,
          backgroundColor: colors.inputBackground,
          color: "white",
          border: `1px solid ${colors.borderPrimary}`,
          fontSize: fontSize.medium,
          cursor: "pointer",
          outline: "none",
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
