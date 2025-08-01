import React from "react";
import { Stack, Typography } from "@mui/material";
import useEggsToSonic from "../hooks/useEggsToSonic";

export const SwapStats: React.FC = () => {
  const { data: rate } = useEggsToSonic();

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Rate
        </Typography>
        <Typography variant="body2">
          1 EGGS = {Number(rate).toFixed(6)} S
        </Typography>
      </Stack>
    </Stack>
  );
};
