import React from "react";
import { Card, Stack, Typography } from "@mui/material";
import { SwapForm } from "./SwapForm";

export const SwapWidget: React.FC = () => {
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
      <SwapForm />
    </Card>
  );
};
