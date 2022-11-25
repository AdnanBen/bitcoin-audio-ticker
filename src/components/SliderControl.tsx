import React from "react";
import { colors, spacing, fontSize } from "../theme/colors";

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: spacing.xs }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: fontSize.medium,
        }}
      >
        <span style={{ color: colors.textPrimary }}>{label}</span>
        <span style={{ color: colors.textSecondary, fontSize: fontSize.small }}>
          {formatValue(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
};
