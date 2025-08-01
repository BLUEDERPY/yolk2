import React, { useEffect, useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { Info } from "lucide-react";
import { formatDate, nFormatter } from "../../utils/formatters";

interface FeesDisplayProps {
  fees: {
    borrowingFee: number;
    protocolFee: number;
    total: number;
    conversionRate: bigint;
  };
  duration: number;
}

export const FeesDisplay: React.FC<FeesDisplayProps> = ({ fees, duration }) => {
  const [borrowingFee, setBorrowFee] = useState(0);
  const [protocolFee, setProtocolFee] = useState(0);
  const [total, setTotal] = useState(0);

  const today = new Date();
  const _endDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) +
      Number(duration + 1 || 1) * 24 * 60 * 60 * 1000
  );

  useEffect(() => {
    if (fees) {
      if (fees.borrowingFee && fees.borrowingFee > 0)
        setBorrowFee(fees.borrowingFee);
      if (fees.protocolFee && fees.protocolFee > 0)
        setProtocolFee(fees.protocolFee);
      if (fees.total && fees.total > 0) setTotal(fees.total);
    }
  }, [fees]);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            Liquidation Fee
          </Typography>
          <Tooltip title="This is the fee if liquidated. If the loan is returned or extended before the expire date, the user can still recover this fee.">
            <Info size={16} />
          </Tooltip>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {nFormatter(Number(protocolFee), 6)} EGGS
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1 }}>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          Borrowing Fee ({duration} days)
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {nFormatter(Number(borrowingFee), 6)} S
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          py: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>Expiration Date</Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {formatDate(_endDate)}{" "}
          {_endDate.toLocaleTimeString().replace(/:\d+ /, " ")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2,
          borderTop: 1,
          borderColor: "divider",
          backgroundColor: "action.hover",
          borderRadius: 1,
          px: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Received</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
          {nFormatter(Number(total), 6)}
        </Typography>
      </Box>
    </>
  );
};
