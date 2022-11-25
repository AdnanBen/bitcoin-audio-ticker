import React from "react";

interface PriceDisplayProps {
  price: number;
  zoomLevel: number;
  started: boolean;
  onStart: () => void;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  zoomLevel,
  started,
  onStart,
}) => {
  return (
    <div className="header-text">
      <p
        onClick={started ? undefined : onStart}
        style={{ cursor: started ? "default" : "pointer" }}
      >
        {started ? `$${price}` : "Click Here To Start"}
      </p>
      <p
        style={{
          fontSize: "0.5em",
          marginBlockStart: "0em",
          marginBlockEnd: "0.5em",
          opacity: started ? 0.6 : 0,
          visibility: started ? "visible" : "hidden",
        }}
      >
        Zoom: {zoomLevel}
      </p>
    </div>
  );
};
