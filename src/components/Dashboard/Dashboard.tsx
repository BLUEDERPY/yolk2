import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { ProtocolMetrics } from "./ProtocolMetrics";
import { LoanExpirationTable } from "./LoanExpirationTable";
import { useEggsData } from "../../providers/data-provider";

export const Dashboard = () => {
  const { loanByDay1, loanByDay2, loanByDay3, loanByDay4, loanByDay5 } =
    useEggsData();

  const loanData = {
    1: loanByDay1,
    2: loanByDay2,
    3: loanByDay3,
    4: loanByDay4,
    5: loanByDay5,
  };

  return (
    <Grid container spacing={3} pl={{ xs: "25px" }} pr={{ xs: "20px" }}>
      <Grid item xs={12}>
        <LoanExpirationTable loanData={loanData} />
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
