import { useState } from "react";
//@ts-expect-error
import { ChartComponent } from "../components/Chart/ChartComponents";
import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SwapWidget } from "../components/Swap/SwapWidget";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileView, setMobileView] = useState<"chart" | "swap">("chart");

  return (
    <>
      {isMobile ? (
        <Grid item xs={12} sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={mobileView}
            exclusive
            onChange={(_, newView) => newView && setMobileView(newView)}
            fullWidth
          >
            <ToggleButton value="chart">Chart</ToggleButton>
            <ToggleButton value="swap">Swap</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ) : (
        <Grid item xs={12} alignSelf={"center"}>
          <Typography padding={1} align="center" variant="h5">
            {" "}
            EGG SWAP{" "}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} mb={"30px"}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            maxWidth: "calc(100dvw - 30px)",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          {(!isMobile || mobileView === "chart") && (
            <ChartComponent data={{}} />
          )}
          {(!isMobile || mobileView === "swap") && <SwapWidget />}
        </Box>
      </Grid>
    </>
  );
};

/*
<Grid item xs={12} alignSelf={"center"}> 
      <WrapSonic> </WrapSonic>
    </Grid>
    <Grid item xs={12} alignSelf={"center"}> 
      <BridgeSonic> </BridgeSonic>
      </Grid> 
 */
export default HomePage;
