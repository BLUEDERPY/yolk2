import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useChartData } from "../../providers/chart-data-provider";

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
  const { 
    formattedChartData, 
    candleSize, 
    setCandleSize,
    connectionStatus,
    isChartDataLoading
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

    // Use formatted chart data from provider
    if (formattedChartData && formattedChartData.length > 0) {
      series.setData(formattedChartData);
      chart.timeScale().fitContent();
    }

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.remove();
      }
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
                      range.time === candleSize
                        ? `${theme.palette.primary.main} !important`
                        : "transparent",
                    color:
                      range.time === candleSize
                        ? `${theme.palette.primary.contrastText} !important`
                        : theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    "&:hover": {
                      backgroundColor: `${theme.palette.primary.main}20`,
                      borderColor: theme.palette.primary.main,
                    },
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
