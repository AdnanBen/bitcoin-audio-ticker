export const colors = {
  appBackground: "#282c34",
  panelBackground: "rgba(40, 44, 52, 0.95)",
  buttonBackground: "rgba(40, 44, 52, 0.9)",
  buttonBackgroundHover: "rgba(50, 54, 62, 0.95)",
  inputBackground: "rgba(0, 0, 0, 0.3)",

  textPrimary: "rgba(255, 255, 255, 0.8)",
  textSecondary: "rgba(255, 255, 255, 0.5)",
  textHover: "rgba(255, 255, 255, 1)",
  textMuted: "rgba(255, 255, 255, 0.6)",
  textBright: "#ffffff",

  borderPrimary: "rgba(255, 255, 255, 0.1)",
  borderSecondary: "rgba(255, 255, 255, 0.08)",

  shadowLight: "rgba(0, 0, 0, 0.2)",
  shadowMedium: "rgba(0, 0, 0, 0.3)",
  shadowHeavy: "rgba(0, 0, 0, 0.4)",
} as const;

export const spacing = {
  xs: "6px",
  sm: "10px",
  md: "16px",
  lg: "20px",
  xl: "24px",
} as const;

export const fontSize = {
  small: "12px",
  medium: "13px",
  normal: "14px",
  large: "15px",
  xlarge: "18px",
  xxlarge: "20px",
} as const;

export const borderRadius = {
  small: "4px",
  medium: "6px",
  large: "10px",
  xlarge: "12px",
  pill: "20px",
  full: "22px",
} as const;
