import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { formatEther } from "viem";
import { formatCurrency } from "../../../utils/formatters";
import { useEggsData } from "../../../providers/data-provider";

interface PositionSummaryProps {
  tokenType?: 'eggs' | 'yolk' | 'nest';
}

export const PositionSummary: React.FC<PositionSummaryProps> = ({ tokenType = 'eggs' }) => {
  const { userData } = useEggsData();
  const loanData = userData[tokenType].loan;
  const collateral = loanData ? Number(formatEther(loanData.collateral)) : 0;
  const borrowed = loanData ? Number(formatEther(loanData.borrowed)) : 0;
  const expiry = loanData ? new Date(Number(loanData.endDate) * 1000) : new Date();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Current Position
      </Typography>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Collateral</Typography>
          <Typography>{formatCurrency(collateral)} EGGS</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Borrowed</Typography>
          <Typography>{formatCurrency(borrowed)} S</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">Expires</Typography>
          <Typography>
            {expiry.toLocaleDateString()} {expiry.toLocaleTimeString()}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
