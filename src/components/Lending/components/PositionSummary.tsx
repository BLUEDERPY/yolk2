import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { formatEther } from "viem";
import { formatCurrency } from "../../../utils/formatters";
import { useEggsData } from "../../../providers/data-provider";

export const PositionSummary = () => {
  const { userLoan: loanData } = useEggsData();

  const collateral = loanData ? Number(formatEther(loanData[0])) : 0;
  const borrowed = loanData ? Number(formatEther(loanData[1])) : 0;
  const expiry = loanData ? new Date(Number(loanData[2]) * 1000) : new Date();

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
