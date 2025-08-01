import React from "react";
import { Card, Stack, Typography } from "@mui/material";
import { SwapForm } from "./SwapForm";

interface SwapWidgetProps {
  tokenType?: 'eggs' | 'yolk' | 'nest';
}
  return (
    <Card
      sx={{
        width: { xs: "calc(100dvw - 30px)", sm: "550px" },
        p: 0,
        borderRadius: { sm: "16px" },
        minHeight: 575,
        height: "fit-content",
        position: "relative",
      }}
    >
      <SwapForm tokenType={tokenType} />
    </Card>
  );
};

export const SwapWidget: React.FC<SwapWidgetProps> = ({ tokenType = 'eggs' }) => {