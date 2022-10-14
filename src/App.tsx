import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { JsonValue } from "react-use-websocket/dist/lib/types";

function App() {
  const [start, setStart] = useState(false);
  const [btcPrice, setBtcPrice] = React.useState("");
  var audioUrl = "https://freewavesamples.com/files/Ensoniq-ESQ-1-Piano-C3.wav";

  const { readyState, sendMessage, lastJsonMessage } = useWebSocket(
    "wss://ws-feed.exchange.coinbase.com"
  );

  useEffect(() => {
    console.log("Page Load");
  }, []);

  useEffect(() => {
    const jsonBody = {
      type: "subscribe",
      product_ids: ["BTC-USD"],
      channels: ["ticker"],
    };

    // check if websocket is open
    if (readyState === ReadyState.OPEN) {
      sendMessage(JSON.stringify(jsonBody));
    }
  }, [readyState]);

  useEffect(() => {
    console.log((lastJsonMessage as any)?.price);
    setBtcPrice((lastJsonMessage as any)?.price);
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log(btcPrice);
    new Audio(audioUrl).play();
  }, [btcPrice, setBtcPrice]);

  return (
    <div className="App">
      <header className="App-header">
        {start ? (
          <p>Price is now ${btcPrice} USD</p>
        ) : (
          <p onClick={() => setStart(true)}>Click here to start</p>
        )}
      </header>
    </div>
  );
}

export default App;
