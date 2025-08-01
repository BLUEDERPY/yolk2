import Card from "@mui/material/Card/Card";
import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useVisibilityChange } from "@uidotdev/usehooks";

import { useTheme } from "@mui/material/styles";
const WS_URL = "wss://eggs-64815067aa3c.herokuapp.com/"; //"ws://localhost:8000";
import { reformatData } from "../Chart/FormatData";

interface TokenChartProps {
  data?: any[];
  timeframe?: "24h" | "7d" | "30d" | "1y";
  showVolume?: boolean;
  priceChangeColor?: string;
  compact?: boolean;
}

export const TokenChart: React.FC<TokenChartProps> = ({
  data,
  timeframe,
  showVolume = true,
  priceChangeColor,
  compact = false,
}) => {
  const xs = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const documentVisible = useVisibilityChange();

  const [ready, setReady] = useState(0);

  const wS_URL =
    (!documentVisible && ready === 1) || documentVisible ? WS_URL : "wss://";

  const { lastMessage, readyState } = useWebSocket(wS_URL, {
    share: true,
    shouldReconnect: () => {
      return documentVisible;
    },
    heartbeat: true,
  });

  useEffect(() => {
    setReady(readyState);
  }, [readyState]);

  const [series, setSeries] = useState(null);
  const [chart, setChart] = useState(null);
  const [updatedata, setData] = useState([]);
  const chartContainerRef = useRef();
  const [candelSize, setCandleSize] = useState(60);

  const setChartInterval = useCallback(
    (interval) => {
      const _data = reformatData(updatedata, interval);
      series.setData(_data);
      chart.timeScale().fitContent();
      setCandleSize(interval);
    },
    [updatedata, chart, series]
  );

  const [fitCheck, setFit] = useState(true);

  useEffect(() => {
    if (series && chart && lastMessage && lastMessage.data !== "ping") {
      const _rawData = JSON.parse(lastMessage.data);
      const rawData = _rawData?.data || [];

      if (rawData.length > 1) {
        ready === 1 &&
          setData((data) => {
            const __data = [...rawData, ...data];
            const _data = reformatData(__data, candelSize);
            series.setData(_data);
            if (_rawData.isFirst && fitCheck) {
              chart.timeScale().fitContent();
              setFit(false);
            }
            localStorage.setItem("egg00ChartData", JSON.stringify(_data));
            return __data;
          });
      }
    }
  }, [series, chart, lastMessage, candelSize, ready, fitCheck]);

  useEffect(() => {
    if (series && chart && lastMessage && lastMessage.data !== "ping") {
      const rawData = JSON.parse(lastMessage.data).data;

      if (rawData.length === 1 && updatedata.length > 0) {
        if (
          rawData[0].high != updatedata[updatedata.length - 1].high ||
          rawData[0].time > updatedata[updatedata.length - 1].time
        ) {
          try {
            let _newData = updatedata;
            _newData[_newData.length - 1] = rawData[0];
            const __data = reformatData(_newData, candelSize);
            series?.update(__data[__data.length - 1]);
            setData((s) => [...s, rawData[0]]);
          } catch {
            // Chart lag handling
          }
        }
      }
    }
  }, [series, chart, lastMessage, updatedata, candelSize]);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: theme.palette.text.secondary,
      },
      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
      width: chartContainerRef.current.clientWidth,
      height: compact ? 200 : 400,
      rightPriceScale: {
        visible: !compact,
      },
      timeScale: {
        visible: !compact,
      },
    });

    chart.timeScale().applyOptions({
      barSpacing: compact ? 6 : 10,
      timeVisible: true,
      fixLeftEdge: true,
      fixRightEdge: true,
    });

    const series = chart.addCandlestickSeries({
      upColor: theme.palette.primary.main,
      downColor: theme.palette.error.main,
      borderVisible: false,
      wickUpColor: theme.palette.primary.main,
      wickDownColor: theme.palette.error.main,
      priceFormat: {
        minMove: 0.0000001,
        precision: 7,
      },
    });

    setSeries(series);
    setChart(chart);

    const cachedata = localStorage.getItem("egg00ChartData");

    if (cachedata) {
      const jsonCacheData = JSON.parse(cachedata);
      series.setData(jsonCacheData);
      chart.timeScale().fitContent();
      setData(jsonCacheData);
      console.log("usedCache");
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [theme, compact, xs]);

  const candleRanges = [
    { text: "1m", time: 1 * 60 },
    { text: "5m", time: 5 * 60 },
    { text: "30m", time: 30 * 60 },
    { text: "1h", time: 60 * 60 },
    { text: "4h", time: 4 * 60 * 60 },
    { text: "1D", time: 60 * 60 * 24 },
    { text: "1W", time: 60 * 60 * 24 * 7 },
    { text: "1M", time: 60 * 60 * 24 * 30 },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: compact ? 200 : 400,
        maxWidth: "100%",
        position: "relative",
        overflow: "hidden",
        bgcolor: "transparent",
      }}
    >
      <Box
        ref={chartContainerRef}
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      />
      {!compact && (
        <Box sx={{ position: "absolute", top: "8px", left: "8px", zIndex: 10 }}>
          {!xs && (
            <ButtonGroup
              variant="outlined"
              size="small"
              aria-label="Chart timeframe selector"
              sx={{
                "& .MuiButton-root": {
                  minWidth: "32px",
                  px: 1,
                  py: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                },
              }}
            >
              {candleRanges.map((range) => (
                <Button
                  key={range.text}
                  sx={{
                    background:
                      range.time === candelSize
                        ? `${theme.palette.primary.main} !important`
                        : "transparent",
                    color:
                      range.time === candelSize
                        ? `${theme.palette.primary.contrastText} !important`
                        : theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}20`,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                  onClick={() => {
                    setChartInterval(range.time);
                  }}
                >
                  {range.text}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </Box>
      )}

      {/* Resize observer to handle container size changes */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
};
