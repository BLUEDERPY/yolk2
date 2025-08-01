import React from "react";
import { Card, Stack, Typography, Box } from "@mui/material";
import { useLendingStats } from "./hooks/useLendingStats";

export const LendingStats: React.FC = () => {
  const { stats } = useLendingStats();

  return (
    <Card sx={{ p: 3, maxWidth: 320, width: "100%" }}>
      <Stack spacing={3}>
        <Typography variant="h6">Protocol Stats</Typography>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Total Value Locked
          </Typography>
          <Typography variant="h5">
            {stats.tvl.toLocaleString()} EGGS
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Total Borrowed
          </Typography>
          <Typography variant="h5">
            {stats.totalBorrowed.toLocaleString()} S
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Current Utilization
          </Typography>
          <Typography variant="h5">{stats.utilization.toFixed(2)}%</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Average Loan Duration
          </Typography>
          <Typography variant="h5">{stats.avgDuration} days</Typography>
        </Box>
      </Stack>
    </Card>
  );
};
