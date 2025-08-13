import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useChartData } from "../../providers/chart-data-provider";

export const ChartComponent = (props) => {
  const xs = useMediaQuery("(max-width:600px)");
  const theme = useTheme();
  const { 
    formattedChartData, 
    candleSize, 
    setCandleSize,
    connectionStatus 
  } = useChartData();

  const [series, setSeries] = useState(null);
  const [chart, setChart] = useState(null);
  const chartContainerRef = useRef();
  
  // Update chart when formatted data changes
  useEffect(() => {
    if (series && formattedChartData.length > 0) {
      series.setData(formattedChartData);
      if (chart) {
        chart.timeScale().fitContent();
      }
    }
  }, [series, chart, formattedChartData]);
  
  const {
    data,
    colors: {
      backgroundColor = theme.palette.background.paper,
      lineColor = theme.palette.primary.main,
      textColor = theme.palette.text.primary,
      areaTopColor = theme.palette.primary.main,
      areaBottomColor = theme.palette.primary.main + "48",
    } = {},
  } = props;

  useEffect(() => {
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: theme.palette.background.paper },
        textColor: theme.palette.text.secondary,
        borderRadius: "10px",
      },

      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
      width: chartContainerRef.current.clientWidth,
      height: xs
        ? window.innerHeight - 410
        : window.innerHeight - 432 > 406
        ? window.innerHeight - 432
        : 406,
    });
    chart.timeScale().applyOptions({
      barSpacing: 10,
      timeVisible: true,
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

    // simulate real-time data
    setSeries(series);
    setChart(chart);

    // Use formatted chart data from provider
    if (formattedChartData && formattedChartData.length > 0) {
      series.setData(formattedChartData);
      if (chart) {
        chart.timeScale().fitContent();
      }
    }

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [theme, formattedChartData]);
  
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
    <Box sx={{ position: "relative" }}>
      <Box
        ref={chartContainerRef}
        borderRadius={"8px"}
        overflow={"hidden"}
        border={`1px solid ${theme.palette.divider}`}
      />
      <Box sx={{ position: "absolute", top: "35px", left: "35px", zIndex: 10 }}>
        {!xs && (
          <ButtonGroup variant="outlined" aria-label="Basic button group">
            {candleRanges.map((range) => (
              <Button
                key={range.text}
                sx={{
                  background:
                    range.time === candleSize
                      ? theme.palette.grey[900] + " !important"
                      : "",
                }}
                onClick={() => {
                  setCandleSize(range.time);
                }}
              >
                {range.text}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </Box>
    </Box>
  );
};
