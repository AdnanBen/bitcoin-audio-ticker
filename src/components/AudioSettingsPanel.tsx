import React, { useState } from "react";
import { AudioSettings, ScaleType } from "../types";
import { SliderControl } from "./SliderControl";
import { SelectControl } from "./SelectControl";
import { colors, spacing, fontSize, borderRadius } from "../theme/colors";

interface AudioSettingsPanelProps {
  settings: AudioSettings;
  onSettingsChange: (settings: Partial<AudioSettings>) => void;
  isOpening: boolean;
  isClosing: boolean;
  onClose: () => void;
}

export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({
  settings,
  onSettingsChange,
  isOpening,
  isClosing,
  onClose,
}) => {
  const [isCloseHovered, setIsCloseHovered] = useState(false);

  const waveformOptions = [
    { value: "sine", label: "Sine" },
    { value: "triangle", label: "Triangle" },
    { value: "square", label: "Square" },
    { value: "sawtooth", label: "Sawtooth" },
  ];

  const scaleOptions = [
    { value: "pentatonic", label: "Pentatonic" },
    { value: "major", label: "Major" },
    { value: "minor", label: "Minor" },
    { value: "chromatic", label: "Chromatic" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "50%",
        transform:
          isClosing || isOpening
            ? "translateX(-50%) translateY(100%)"
            : "translateX(-50%) translateY(0)",
        width: "90%",
        maxWidth: "600px",
        backgroundColor: colors.panelBackground,
        backdropFilter: "blur(10px)",
        padding: spacing.xl,
        borderRadius: `${borderRadius.xlarge} ${borderRadius.xlarge} 0 0`,
        display: "flex",
        flexDirection: "column",
        gap: spacing.md,
        fontSize: fontSize.normal,
        maxHeight: "70vh",
        overflowY: "auto",
        boxShadow: `0 -4px 16px ${colors.shadowHeavy}`,
        border: `1px solid ${colors.borderSecondary}`,
        borderBottom: "none",
        opacity: isClosing || isOpening ? 0 : 1,
        transition: "transform 0.25s ease-out, opacity 0.25s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: spacing.sm,
          borderBottom: `1px solid ${colors.borderPrimary}`,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: fontSize.large,
            fontWeight: "500",
            color: colors.textBright,
            opacity: 0.9,
          }}
        >
          Audio Settings
        </h3>
        <button
          onClick={onClose}
          style={{
            background: isCloseHovered
              ? `rgba(255,255,255,0.1)`
              : "transparent",
            border: "none",
            color: isCloseHovered ? colors.textHover : colors.textMuted,
            cursor: "pointer",
            padding: "4px",
            fontSize: fontSize.xxlarge,
            transition: "all 0.2s ease",
            borderRadius: borderRadius.small,
            lineHeight: 1,
          }}
          onMouseEnter={() => setIsCloseHovered(true)}
          onMouseLeave={() => setIsCloseHovered(false)}
        >
          ↓
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: spacing.lg,
          width: "100%",
        }}
      >
        <SliderControl
          label="Volume"
          value={settings.volume * 100}
          min={0}
          max={100}
          step={1}
          onChange={(value) => onSettingsChange({ volume: value / 100 })}
          formatValue={(value) => `${Math.round(value)}%`}
        />

        <SliderControl
          label="Min Change in Price"
          value={settings.minPriceChange}
          min={0}
          max={5}
          step={0.1}
          onChange={(value) => onSettingsChange({ minPriceChange: value })}
          formatValue={(value) => `$${value.toFixed(1)}`}
        />

        <SelectControl
          label="Waveform"
          value={settings.waveform}
          options={waveformOptions}
          onChange={(value) =>
            onSettingsChange({ waveform: value as OscillatorType })
          }
        />

        <SelectControl
          label="Scale"
          value={settings.scale}
          options={scaleOptions}
          onChange={(value) => onSettingsChange({ scale: value as ScaleType })}
        />

        <SliderControl
          label="Max Note Length"
          value={settings.maxSustainDuration}
          min={1000}
          max={10000}
          step={500}
          onChange={(value) => onSettingsChange({ maxSustainDuration: value })}
          formatValue={(value) => `${(value / 1000).toFixed(1)}s`}
        />

        <SliderControl
          label="Octave"
          value={settings.baseOctave}
          min={2}
          max={6}
          step={1}
          onChange={(value) => onSettingsChange({ baseOctave: value })}
          formatValue={(value) => value.toString()}
        />
      </div>
    </div>
  );
};
