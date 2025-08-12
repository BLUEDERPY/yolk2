import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { formatEther } from "viem";

interface CollateralDisplayProps {
  collateralRequired: number;
  borrowAmount: string;
  tokenConfig?: {
    tokenName: string;
    backingToken: string;
    backingTitle: string;
  };
  tokenType?: 'eggs' | 'yolk' | 'nest';
}

export const CollateralDisplay: React.FC<CollateralDisplayProps> = ({
  collateralRequired,
  borrowAmount,
  tokenConfig = { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" },
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Required Collateral
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
        {collateralRequired} {tokenConfig.tokenName}
      </Typography>
    </Box>
  );
};
