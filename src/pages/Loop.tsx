import { Grid, Typography } from "@mui/material";
import { LeverageCalculator } from "../components/Leverage/LeverageCalculator";

const LoopPage = () => {
  return (
    <>
      <Grid item xs={12} alignSelf={"center"}>
        <Typography align="center" variant="h5">
          {" "}
          LEVERAGE{" "}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <LeverageCalculator />
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
export default LoopPage;
