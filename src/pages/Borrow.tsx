import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { LendingInterface } from "../components/Lending/LendingInterface";
import { LendingStats } from "../components/Lending/LendingStats";

const LendingPage: React.FC = () => {
  return (
    <>
      <Grid item xs={12} alignSelf="center">
        <Typography padding={0} align="center" variant="h5">
          LENDING
        </Typography>
      </Grid>
      <Grid item xs={12} alignSelf="center" mb={"30px"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            maxWidth: "calc(100dvw - 30px)",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <LendingInterface />
        </Box>
      </Grid>
    </>
  );
};

export default LendingPage;
