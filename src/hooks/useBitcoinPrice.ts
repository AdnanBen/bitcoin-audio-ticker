import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { PriceData, CoinbaseMessage } from "../types";

export const useBitcoinPrice = (): PriceData & {
  connectionState: ReadyState;
  setDisplayedPrice: (price: number) => void;
} => {
  const [btcPrice, setBtcPrice] = useState(19120);
  const [displayedbtcPrice, setDisplayedbtcPrice] = useState(19120);
  const [lastPrice, setLastPrice] = useState(0);

  const { readyState, sendMessage, lastJsonMessage } = useWebSocket(
    "wss://ws-feed.exchange.coinbase.com"
  );

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      sendMessage(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD"],
          channels: ["ticker"],
        })
      );
    }
  }, [readyState, sendMessage]);

  useEffect(() => {
    if (lastJsonMessage) {
      const message = lastJsonMessage as unknown as CoinbaseMessage;

      if (message.type === "ticker" && message.price) {
        const newPrice = parseFloat(message.price);
        setLastPrice(btcPrice);
        setBtcPrice(newPrice);
      }
    }
  }, [lastJsonMessage, btcPrice]);

  return {
    btcPrice,
    displayedPrice: displayedbtcPrice,
    lastPrice,
    connectionState: readyState,
    setDisplayedPrice: setDisplayedbtcPrice,
  };
};
