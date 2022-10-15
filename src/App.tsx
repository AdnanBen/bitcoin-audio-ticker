import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
import beep from "./assets/key01.mp3";

function App() {
  const [start, setStart] = useState(false);
  const [btcPrice, setBtcPrice] = React.useState(19120);

  const [zoomLevel, setZoomLevel] = useState(6);

  const [state, setState] = useState({
    series: [
      {
        data: [],
      },
    ],
    options: {
      theme: {
        mode: "dark" as ApexTheme["mode"],
      },

      chart: {
        tooltip: {
          enabled: true,
          enabledOnSeries: false,
          followCursor: false,
          x: {
            show: false,
          },
        },
        background: "#282c34",
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
      selection: {
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
    },
  });

  const { readyState, sendMessage, lastJsonMessage } = useWebSocket(
    "wss://ws-feed.exchange.coinbase.com"
  );

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
    const price = parseFloat((lastJsonMessage as any)?.price);
    if (price) {
      setBtcPrice(price);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    console.log(state);
    if (start) {
      const timeout = setInterval(() => {
        const currentPrice = btcPrice;
        var audio = new Audio(beep);
        // audio.play();
        console.log(state);
        setState((prev) => {
          console.log("pushing" + currentPrice);
          let newState = JSON.parse(JSON.stringify(prev));
          newState.options.yaxis.max = parseInt(String(btcPrice)) + zoomLevel;
          newState.options.yaxis.min = parseInt(String(btcPrice)) - zoomLevel;
          newState.options.chart.height = 100;
          newState.series[0]["data"].push(currentPrice);
          return newState;
        });

        // Other approach, maybe more efficient?

        // setState((prev) => {
        //   const deepArrClone = JSON.parse(JSON.stringify(prev.series));
        //   deepArrClone[0]["data"].push(btcPrice);
        //   return { ...prev, series: deepArrClone };
        // });
      }, 1000);

      return () => clearInterval(timeout);
    }
  }, [state, start]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-text">
          {start ? (
            <p>${btcPrice}</p>
          ) : (
            <p onClick={() => setStart(true)}>Click here to start</p>
          )}
        </div>

        <ReactApexChart
          onWheel={(e: any) => {
            console.log(zoomLevel);
            if (e.deltaY == 100) {
              setZoomLevel((prev) => prev + 1);
            } else {
              setZoomLevel((prev) => {
                if (prev > 1) {
                  return prev - 1;
                } else {
                  return prev;
                }
              });
            }
          }}
          className="chart"
          options={state.options}
          series={state.series}
          height={"80%"}
        />

        <p className="footer-text">{zoomLevel}</p>
      </header>
    </div>
  );
}

export default App;
