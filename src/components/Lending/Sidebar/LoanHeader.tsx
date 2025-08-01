import React from "react";
import { Box, Typography } from "@mui/material";
import { LoanStatus } from "./LoanStatus";
import { formatCurrency } from "../../../utils/formatters";
import type { LoanData } from "./types";

interface LoanHeaderProps {
  loanData: LoanData;
}

export const LoanHeader: React.FC<LoanHeaderProps> = ({ loanData }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Loan Summary
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {formatCurrency(loanData.totalAmount)} S
      </Typography>
      <LoanStatus status={loanData.status} />
    </Box>
  );
};
