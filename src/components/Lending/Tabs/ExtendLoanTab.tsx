import React, { useEffect, useState } from "react";
import { Stack, Typography, Slider, Alert, Button, Grid, Box } from "@mui/material";
import { formatDate } from "../../../utils/formatters";

import { formatEther } from "viem";

import LoadingScreen from "../../LoadingScreen";
import { useEggsData } from "../../../providers/data-provider";
import { getInterestFeeInEggs } from "../../../utils/leverageCalculations";

export const ExtendLoanTab = ({ tokenType = 'eggs' }: { tokenType?: 'eggs' | 'yolk' | 'nest' }) => {
  const [extensionDays, setExtensionDays] = useState(1);

  const {
    userData,
    isConfirming,
    isPending,
    extendLoan,
  } = useEggsData();
  
  // Use specified token data
  const loanData = userData[tokenType].loan;
  const balance = userData[tokenType].backingBalance;
  const eggs = userData[tokenType].balance;
  
  function dateDiff(date1, date2) {
    const msDiff = date1.getTime() - date2.getTime();
    const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    return days;
  }

  const currentExpiry = loanData
    ? new Date(Number(loanData.endDate) * 1000)
    : new Date();
  const newExpiry = new Date(
    currentExpiry.getTime() + extensionDays * 24 * 60 * 60 * 1000
  );
  const max = 365 - dateDiff(currentExpiry, new Date());

  const fee = getInterestFeeInEggs(loanData.borrowed, extensionDays);
  const feeAmount = fee ? Number(formatEther(fee)) : 0;

  return (
    <Stack
      spacing={3}
      minHeight={"479px"}
      position={"relative"}
      pt={"24px"}
      sx={{ height: '100%' }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Extend Loan
      </Typography>

      {isConfirming || isPending ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <LoadingScreen />
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack spacing={3}>
              <Grid
                container
                sx={{
                  textAlign: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Grid item>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">New Expiration Date</Typography>
                    <Typography variant="h6">
                      {formatDate(newExpiry)}{" "}
                      {newExpiry.toLocaleTimeString().replace(/:\d+ /, " ")}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack spacing={2}>
                    <Typography variant="subtitle2">Extension Period</Typography>
                    <Typography variant="h6"> {extensionDays} days</Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Stack spacing={2}>
                <Grid
                  container
                  spacing={2}
                  sx={{ alignItems: "center", width: "100%" }}
                >
                  <Grid item>
                    <Typography variant="subtitle2">1 day</Typography>
                  </Grid>
                  <Grid item xs>
                    <Slider
                      value={extensionDays}
                      onChange={(_, value) => setExtensionDays(value as number)}
                      min={1}
                      max={max}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle2">{max} days</Typography>
                  </Grid>
                </Grid>
              </Stack>

              <Alert severity="info">Extension fee: {feeAmount.toFixed(4)} S</Alert>
            </Stack>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="contained"
              onClick={() => extendLoan(extensionDays, formatEther(fee), tokenType)}
              disabled={extensionDays <= 0 || balance?.value < fee}
              fullWidth
            >
              Extend Loan
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};
