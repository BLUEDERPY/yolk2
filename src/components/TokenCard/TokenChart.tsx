import Card from "@mui/material/Card/Card";
import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useVisibilityChange } from "@uidotdev/usehooks";

import { useTheme } from "@mui/material/styles";
import { useEggsData } from "../../providers/data-provider";
const WS_URL = "wss://eggs-64815067aa3c.herokuapp.com/"; //"ws://localhost:8000";
import { reformatData } from "../Chart/FormatData";

interface TokenChartProps {
  data?: any[];
  timeframe?: "24h" | "7d" | "30d" | "1y";
  showVolume?: boolean;
  priceChangeColor?: string;
  compact?: boolean;
  tokenType?: 'eggs' | 'yolk' | 'nest';
}

export const TokenChart: React.FC<TokenChartProps> = ({
  data,
  timeframe,
  showVolume = true,
  priceChangeColor,
  compact = false,
  tokenType = 'eggs',
}) => {
  const xs = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const documentVisible = useVisibilityChange();
  const { chartData: providerChartData, isChartDataLoading } = useEggsData();

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
  const [updatedata, setData] = useState<any[]>([]);
  const chartContainerRef = useRef();
  const [candelSize, setCandleSize] = useState(60);

  // Initialize chart data from provider
  useEffect(() => {
    if (providerChartData && providerChartData.length > 0 && updatedata.length === 0) {
      setData(providerChartData);
    }
  }, [providerChartData, updatedata.length]);

  const setChartInterval = useCallback(
    (interval) => {
      const _data = reformatData(updatedata, interval);
      if (series && chart) {
        series.setData(_data);
        chart.timeScale().fitContent();
      }
      setCandleSize(interval);
    },
    [updatedata, chart, series]
  );

  const [fitCheck, setFit] = useState(true);

  useEffect(() => {
    if (series && chart && lastMessage && lastMessage.data !== "ping") {
      let _rawData;
      try {
        _rawData = JSON.parse(lastMessage.data);
      } catch (error) {
        console.warn("Failed to parse WebSocket message:", error);
        return;
      }
      
      const rawData = _rawData?.data || [];

      if (rawData.length > 1) {
        ready === 1 &&
          setData((data) => {
            const __data = [...rawData, ...data.slice(0, 10000)]; // Limit data size
            const _data = reformatData(__data, candelSize);
            if (series) {
              series.setData(_data);
            }
            if (_rawData.isFirst && fitCheck) {
              if (chart) {
                chart.timeScale().fitContent();
              }
              setFit(false);
            }
            try {
              localStorage.setItem("egg00ChartData", JSON.stringify(_data.slice(-1000))); // Limit stored data
            } catch (e) {
              console.warn("Failed to save chart data to localStorage:", e);
            }
            return __data;
          });
      }
    }
  }, [series, chart, lastMessage, candelSize, ready, fitCheck]);

  useEffect(() => {
    if (series && chart && lastMessage && lastMessage.data !== "ping") {
      let rawData;
      try {
        rawData = JSON.parse(lastMessage.data).data;
      } catch (error) {
        console.warn("Failed to parse WebSocket message:", error);
        return;
      }

      if (rawData.length === 1 && updatedata.length > 0) {
        if (
          rawData[0].high != updatedata[updatedata.length - 1].high ||
          rawData[0].time > updatedata[updatedata.length - 1].time
        ) {
          try {
            let _newData = [...updatedata]; // Create copy instead of mutating
            _newData[_newData.length - 1] = rawData[0];
            const __data = reformatData(_newData, candelSize);
            series?.update(__data[__data.length - 1]);
            setData((s) => [...s.slice(-10000), rawData[0]]); // Limit array growth
          } catch {
            console.warn("Chart update error:", error);
          }
        }
      }
    }
  }, [series, chart, lastMessage, updatedata, candelSize]);

  useEffect(() => {
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    if (!chartContainerRef.current) {
      return;
    }

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

    // Use provider chart data or fallback to localStorage
    if (providerChartData && providerChartData.length > 0) {
      series.setData(providerChartData);
      chart.timeScale().fitContent();
      setData(providerChartData);
    } else {
      const cachedata = localStorage.getItem("egg00ChartData");
      if (cachedata) {
        try {
          const jsonCacheData = JSON.parse(cachedata);
          if (Array.isArray(jsonCacheData) && jsonCacheData.length > 0) {
            series.setData(jsonCacheData);
            chart.timeScale().fitContent();
            setData(jsonCacheData);
            console.log("Used cached chart data");
          }
        } catch (e) {
          console.warn("Failed to parse cached chart data:", e);
          localStorage.removeItem("egg00ChartData");
        }
      }
    }

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [chartContainerRef, theme, compact, providerChartData]);

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
