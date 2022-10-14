import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [start, setStart] = useState(false);
  const [btcPrice, setBtcPrice] = React.useState("");
  var audioUrl = "https://freewavesamples.com/files/Ensoniq-ESQ-1-Piano-C3.wav";

  useEffect(() => {
    console.log("Page Load");
  }, []);

  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        fetch("https://api.coinbase.com/v2/prices/BTC-USD/buy")
          .then((res) => res.json())
          .then((data) => {
            console.log("called");
            setBtcPrice(data.data.amount);
          });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [start]);

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
