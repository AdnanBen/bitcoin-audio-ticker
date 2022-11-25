import { useState, useRef, useCallback } from "react";
import { ChartState, SCALES, ScaleType, BPM } from "../types";
import { ApexOptions } from "apexcharts";

interface ChartUpdateHook {
  chartState: ChartState;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  updateChart: (
    btcPrice: number,
    minPriceChange: number,
    scale: ScaleType,
    playNote: (noteIndex: number, magnitude: number, sustain: boolean) => void
  ) => void;
  currentNoteIndex: React.MutableRefObject<number>;
}

export const useChartUpdate = (): ChartUpdateHook => {
  const [zoomLevel, setZoomLevel] = useState(5);
  const currentNoteIndex = useRef(5);
  const lastPriceRef = useRef(0);

  const [chartState, setChartState] = useState<ChartState>({
    series: [
      {
        name: "BTC Price",
        data: [],
      },
    ],
    options: {
      theme: {
        mode: "dark",
      },
      chart: {
        background: "#282c34",
        height: 350,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: {
            speed: BPM,
          },
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: false,
      },
      dataLabels: {
        enabled: false,
      },
      selection: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "#282c34"],
          opacity: 0.1,
        },
      },
      yaxis: {
        max: 19250,
        min: 19100,
      },
      xaxis: {
        show: false,
        labels: {
          show: false,
        },
        axisBorder: {
          color: "#282c34",
          show: false,
        },
        axisTicks: {
          show: false,
        },
        range: 13,
      },
    } as ApexOptions,
  });

  const updateChart = useCallback(
    (
      btcPrice: number,
      minPriceChange: number,
      scale: ScaleType,
      playNote: (noteIndex: number, magnitude: number, sustain: boolean) => void
    ) => {
      const lastPrice = lastPriceRef.current;

      if (lastPrice !== 0) {
        const diff = btcPrice - lastPrice;

        if (Math.abs(diff) >= minPriceChange) {
          if (diff > 0) {
            currentNoteIndex.current += 1;
          } else if (diff < 0) {
            currentNoteIndex.current -= 1;
          }
          const currentScale = SCALES[scale];
          const maxIndex = currentScale.length * 2;
          const middleIndex = Math.floor(maxIndex / 2);

          if (
            currentNoteIndex.current < 0 ||
            currentNoteIndex.current >= maxIndex
          ) {
            currentNoteIndex.current = middleIndex;
          }

          playNote(currentNoteIndex.current, Math.abs(diff), true);
        } else if (diff === 0) {
          playNote(currentNoteIndex.current, 0, true);
        }
      }

      lastPriceRef.current = btcPrice;

      setChartState((prev) => {
        const newState = JSON.parse(JSON.stringify(prev));
        newState.options.yaxis.max = parseInt(String(btcPrice)) + zoomLevel;
        newState.options.yaxis.min = parseInt(String(btcPrice)) - zoomLevel;
        newState.options.chart.height = 100;
        newState.series[0].data.push(btcPrice);
        return newState;
      });
    },
    [zoomLevel]
  );

  return {
    chartState,
    zoomLevel,
    setZoomLevel,
    updateChart,
    currentNoteIndex,
  };
};
