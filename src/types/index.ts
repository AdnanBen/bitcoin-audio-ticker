export type ScaleType = "pentatonic" | "major" | "minor" | "chromatic";
export type EnvelopeSpeed = "snappy" | "normal" | "smooth";
export type PolyphonyMode = "single" | "harmony" | "chord";

export interface AudioSettings {
  waveform: OscillatorType;
  scale: ScaleType;
  baseOctave: number;
  volume: number;
  minPriceChange: number;
  maxSustainDuration: number;
  bpm: number;
  reverb: number;
  envelopeSpeed: EnvelopeSpeed;
  pitchShift: number;
  sustainDepth: number;
  polyphony: PolyphonyMode;
}

export interface AudioControls {
  playNote: (
    noteIndex: number,
    priceChangeMagnitude?: number,
    sustain?: boolean
  ) => void;
  enableAudio: () => Promise<boolean>;
}

export interface PriceData {
  btcPrice: number;
  displayedPrice: number;
  lastPrice: number;
}

export interface ChartState {
  options: any; // ApexCharts options type
  series: Array<{ name: string; data: number[][] }>;
}

export interface SettingsAnimationState {
  settingsCollapsed: boolean;
  isOpening: boolean;
  isClosing: boolean;
  handleOpenSettings: () => void;
  handleCloseSettings: () => void;
}

export interface CoinbaseMessage {
  type: string;
  product_id?: string;
  price?: string;
  time?: string;
}

export const SCALES: Record<ScaleType, number[]> = {
  pentatonic: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24],
  major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24],
  minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24],
  chromatic: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24,
  ],
};

export const BPM = 700;
