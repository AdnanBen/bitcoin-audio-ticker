import React from "react";
import ReactApexChart from "react-apexcharts";
import { ChartState } from "../types";

interface ChartComponentProps {
  chartState: ChartState;
  onZoomChange: (delta: number) => void;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  chartState,
  onZoomChange,
}) => {
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY === 100) {
      onZoomChange(1);
    } else {
      onZoomChange(-1);
    }
  };

  return (
    <ReactApexChart
      onWheel={handleWheel}
      className="chart"
      options={chartState.options}
      series={chartState.series}
      height="80%"
    />
  );
};
