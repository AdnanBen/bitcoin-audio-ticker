import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";

function App() {
  const [start, setStart] = useState(false);
  const [btcPrice, setBtcPrice] = React.useState(19120);
  var audioUrl = "https://freewavesamples.com/files/Ensoniq-ESQ-1-Piano-C3.wav";

  const [data, setData] = useState([19120, 19125]);

  const [state, setState] = useState({
    series: [
      {
        data: [19080, 19080, 19082],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line" as ApexChart["type"],
        animations: {
          enabled: true,
          easing: "linear" as Exclude<
            ApexChart["animations"],
            undefined
          >["easing"],
          dynamicAnimation: {
            speed: 1000,
          },
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth" as ApexStroke["curve"],
      },
      markers: {
        size: 0,
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      yaxis: {
        max: 19250,
        min: 19190,
      },
      xaxis: { range: 10 },
    },
  });

  const { readyState, sendMessage, lastJsonMessage } = useWebSocket(
    "wss://ws-feed.exchange.coinbase.com"
  );

  useEffect(() => {
    console.log("rerender");
  });

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
    setBtcPrice((lastJsonMessage as any)?.price);
  }, [lastJsonMessage]);

  useEffect(() => {
    // new Audio(audioUrl).play();
  }, [btcPrice, setBtcPrice]);

  useEffect(() => {
    const timeout = setInterval(() => {
      console.log("new price is " + btcPrice);

      console.log(data.length);
      // setState((prev) => {
      //   let tempVar = JSON.parse(JSON.stringify(prev));
      //   tempVar.series[0]["data"].push(btcPrice);
      //   console.log(tempVar);
      //   return tempVar;
      // });

      setState((prev) => {
        const deepArrClone = JSON.parse(JSON.stringify(prev.series));
        deepArrClone[0]["data"].push(btcPrice);
        return { ...prev, series: deepArrClone };
      });
    }, 1000);

    console.log(state);

    return () => clearInterval(timeout);
  }, [state]);

  return (
    // <div>
    //   <header>
    <div className="App">
      <header>
        <ReactApexChart
          options={state.options}
          series={state.series}
          height={1000}
        />
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
