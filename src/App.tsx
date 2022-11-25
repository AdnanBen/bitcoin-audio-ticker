import { useState, useEffect, useRef } from "react";
import "./App.css";
import { AudioSettings, BPM } from "./types";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { useBitcoinPrice } from "./hooks/useBitcoinPrice";
import { useChartUpdate } from "./hooks/useChartUpdate";
import { useSettingsAnimation } from "./hooks/useSettingsAnimation";
import { PriceDisplay } from "./components/PriceDisplay";
import { ChartComponent } from "./components/ChartComponent";
import { SettingsToggleButton } from "./components/SettingsToggleButton";
import { AudioSettingsPanel } from "./components/AudioSettingsPanel";

function App() {
  const [start, setStart] = useState(false);

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    waveform: "sine",
    scale: "pentatonic",
    baseOctave: 4,
    volume: 0.05,
    minPriceChange: 0,
    maxSustainDuration: 5000,
  });

  const { playNote } = useAudioEngine(audioSettings);
  const { btcPrice, displayedPrice, setDisplayedPrice } = useBitcoinPrice();
  const { chartState, zoomLevel, setZoomLevel, updateChart } = useChartUpdate();
  const {
    settingsCollapsed,
    isOpening,
    isClosing,
    handleOpenSettings,
    handleCloseSettings,
  } = useSettingsAnimation();

  const playNoteRef = useRef(playNote);
  const updateChartRef = useRef(updateChart);
  const btcPriceRef = useRef(btcPrice);
  const minPriceChangeRef = useRef(audioSettings.minPriceChange);
  const scaleRef = useRef(audioSettings.scale);

  useEffect(() => {
    playNoteRef.current = playNote;
    updateChartRef.current = updateChart;
    btcPriceRef.current = btcPrice;
    minPriceChangeRef.current = audioSettings.minPriceChange;
    scaleRef.current = audioSettings.scale;
  }, [
    playNote,
    updateChart,
    btcPrice,
    audioSettings.minPriceChange,
    audioSettings.scale,
  ]);

  const handleSettingsChange = (newSettings: Partial<AudioSettings>) => {
    setAudioSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleZoomChange = (delta: number) => {
    setZoomLevel((prev: number) => {
      if (delta > 0) {
        return prev + 1;
      } else if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setDisplayedPrice(btcPriceRef.current);
        updateChartRef.current(
          btcPriceRef.current,
          minPriceChangeRef.current,
          scaleRef.current,
          playNoteRef.current
        );
      }, BPM);

      return () => clearInterval(interval);
    }
  }, [start, setDisplayedPrice]);

  return (
    <div className="App">
      <header className="App-header">
        <PriceDisplay
          price={displayedPrice}
          zoomLevel={zoomLevel}
          started={start}
          onStart={() => setStart(true)}
        />

        <ChartComponent
          chartState={chartState}
          onZoomChange={handleZoomChange}
        />

        <SettingsToggleButton
          isVisible={settingsCollapsed || isClosing}
          onClick={handleOpenSettings}
          isDisabled={isClosing}
        />

        {!settingsCollapsed && (
          <AudioSettingsPanel
            settings={audioSettings}
            onSettingsChange={handleSettingsChange}
            isOpening={isOpening}
            isClosing={isClosing}
            onClose={handleCloseSettings}
          />
        )}
      </header>
    </div>
  );
}

export default App;
