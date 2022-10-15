import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";

import audio_key1 from "./assets/key01.mp3";
import audio_key2 from "./assets/key02.mp3";
import audio_key3 from "./assets/key03.mp3";
import audio_key4 from "./assets/key04.mp3";
import audio_key5 from "./assets/key05.mp3";
import audio_key6 from "./assets/key06.mp3";
import audio_key7 from "./assets/key07.mp3";
import audio_key8 from "./assets/key08.mp3";
import audio_key9 from "./assets/key09.mp3";
import audio_key10 from "./assets/key10.mp3";
import audio_key11 from "./assets/key11.mp3";
import audio_key12 from "./assets/key12.mp3";
import audio_key13 from "./assets/key13.mp3";
import audio_key14 from "./assets/key14.mp3";
import audio_key15 from "./assets/key15.mp3";
import audio_key16 from "./assets/key16.mp3";
import audio_key17 from "./assets/key17.mp3";
import audio_key18 from "./assets/key18.mp3";
import audio_key19 from "./assets/key19.mp3";
import audio_key20 from "./assets/key20.mp3";
import audio_key21 from "./assets/key21.mp3";
import audio_key22 from "./assets/key22.mp3";
import audio_key23 from "./assets/key23.mp3";
import audio_key24 from "./assets/key24.mp3";

let audio_array: any[] = [];
audio_array.push(audio_key1);
audio_array.push(audio_key2);
audio_array.push(audio_key3);
audio_array.push(audio_key4);
audio_array.push(audio_key5);
audio_array.push(audio_key6);
audio_array.push(audio_key7);
audio_array.push(audio_key8);
audio_array.push(audio_key9);
audio_array.push(audio_key10);
audio_array.push(audio_key11);
audio_array.push(audio_key12);
audio_array.push(audio_key13);
audio_array.push(audio_key14);
audio_array.push(audio_key15);
audio_array.push(audio_key16);
audio_array.push(audio_key17);
audio_array.push(audio_key18);
audio_array.push(audio_key19);
audio_array.push(audio_key20);
audio_array.push(audio_key21);
audio_array.push(audio_key22);
audio_array.push(audio_key23);
audio_array.push(audio_key24);

const bpm = 700;

function App() {
  const [start, setStart] = useState(false);
  const [btcPrice, setBtcPrice] = React.useState(19120);

  const [lastPrice, setLastPrice] = React.useState(0);
  const [audioKey, setAudioKey] = React.useState(11);

  const [zoomLevel, setZoomLevel] = useState(5);

  const { readyState, sendMessage, lastJsonMessage } = useWebSocket(
    "wss://ws-feed.exchange.coinbase.com"
  );

  useEffect(() => {
    const jsonBody = {
      type: "subscribe",
      product_ids: ["BTC-USD"],
      channels: ["ticker"],
    };

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
            speed: bpm,
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
        curve: "smooth" as ApexStroke["curve"],
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

  function updateChart() {
    const currentPrice = btcPrice;
    if (lastPrice !== 0) {
      let currentAudioKey = audioKey;
      const diff = currentPrice - lastPrice;
      console.log(diff);
      if (diff > 0) {
        currentAudioKey += 1;
      } else if (diff < 0) {
        currentAudioKey -= 1;
      }

      var audio = new Audio(audio_array[currentAudioKey]);
      audio.play();
      setAudioKey(currentAudioKey);
    }

    setLastPrice(currentPrice);
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
  }

  useEffect(() => {
    console.log(state);

    if (start) {
      const timeout = setInterval(updateChart, bpm);
      return () => clearInterval(timeout);
    }
  }, [state, start]);

  useEffect(() => {
    if (start) {
      updateChart();
    }
  }, [start]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-text">
          {start ? (
            <p>${btcPrice}</p>
          ) : (
            <p onClick={() => setStart(true)}>Click Here To Start</p>
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
