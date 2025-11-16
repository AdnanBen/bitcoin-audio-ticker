import React from "react";

interface PriceDisplayProps {
  price: number;
  zoomLevel: number;
  started: boolean;
  onStart: () => void;
  onEnableAudio: () => Promise<boolean>;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  zoomLevel,
  started,
  onStart,
  onEnableAudio,
}) => {
  const handleStart = async () => {
    const result = await onEnableAudio();
    console.log("Audio enabled:", result);
    onStart();
  };

  return (
    <div className="header-text">
      <p
        onClick={started ? undefined : handleStart}
        style={{ cursor: started ? "default" : "pointer" }}
      >
        {started ? `$${price}` : "Click To Start"}
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
        Zoom: {zoomLevel} (Scroll/Pinch To Change)
      </p>
    </div>
  );
};
