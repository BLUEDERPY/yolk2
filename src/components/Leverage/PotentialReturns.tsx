import React, { useState } from "react";
import { Box, Stack, Typography, Slider, LinearProgress } from "@mui/material";
import { nFormatter } from "../../utils/formatters";
import { TrendingUp } from "lucide-react";
import chroma from "chroma-js";
import { parseEther } from "viem";
import { useTheme } from "@mui/material/styles";

interface PotentialReturnsProps {
  scenarios: Array<{
    label: string;
    profit: number;
    roi: number;
  }>;
  borrowAmount: number;
  leverageX: number;
  fee: number;
  tokenType?: 'eggs' | 'yolk' | 'nest';
}

export const PotentialReturns = ({
  scenarios,
  leverageX,
  borrowAmount,
  fee,
  tokenType = 'eggs',
}: PotentialReturnsProps) => {
  const theme = useTheme();
  const [priceIncrease, setPriceIncrease] = useState(100);
  const leveragePercentage = scenarios[2].roi / 100; // Calculate leverage from 100% scenario

  // Create color scale
  const colorScale = chroma
    .scale([theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main])
    .mode("lch");

  // Calculate custom scenario based on slider
  const customScenario =
    scenarios.find((s) => Number(s.label.replace("%", "")) >= priceIncrease) ||
    scenarios[2];
  const _borrowAmount = borrowAmount * 0.99 - fee;
  const scaledProfit = _borrowAmount * (priceIncrease / 100) - fee;
  const scaledROI = (scaledProfit * 100) / fee;
  return (
    <Box sx={{ p: 3, pt: 6, minWidth: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack spacing={4}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Leverage
          </Typography>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {leverageX ? leverageX.toFixed(2) + "X" : "--"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Position Multiplier
          </Typography>
        </Box>

        <Box>
          <Typography gutterBottom>Price Increase: {priceIncrease}%</Typography>
          <Slider
            value={priceIncrease}
            onChange={(_, value) => setPriceIncrease(value as number)}
            min={0}
            max={1000}
            valueLabelDisplay="auto"
            sx={{
              "& .MuiSlider-thumb": {
                backgroundColor: colorScale(priceIncrease / 1000).hex(),
              },
              "& .MuiSlider-track": {
                backgroundColor: colorScale(priceIncrease / 1000).hex(),
              },
            }}
          />
        </Box>

        <Box sx={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Estimated Return
          </Typography>
          <Typography
            variant="h4"
            sx={{ color: scaledProfit > 0 ? "success.main" : "error.main" }}
          >
            {scaledProfit > 0 ? "+" : ""}
            {nFormatter(scaledProfit, 2)} {tokenType === 'eggs' ? 'S' : tokenType === 'yolk' ? 'USDC' : 'EGGS'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            ROI: {scaledROI > 0 ? "+" : ""}
            {scaledROI ? scaledROI.toFixed(1) : "-- "}%
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(Math.abs(scaledROI), 1000) / 10}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: theme.palette.action.disabled,
              "& .MuiLinearProgress-bar": {
                backgroundColor: colorScale(priceIncrease / 1000).hex(),
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
};
