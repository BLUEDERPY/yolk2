import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Alert,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { formatEther, parseEther } from "viem";

import LoadingScreen from "../../LoadingScreen";
import { nFormatter } from "../../../utils/formatters";

import useConverter from "../../../hooks/useConverter";
import { useEggsData } from "../../../providers/data-provider";

type CloseMethod = "standard" | "flash";

export const ClosePositionTab = ({ tokenType = 'eggs' }: { tokenType?: 'eggs' | 'yolk' | 'nest' }) => {
  const [closeMethod, setCloseMethod] = useState<CloseMethod>("standard");
  const [repayAmount, setRepayAmount] = useState<string>("0");

  const {
    closePosition,
    repay,
    isConfirming,
    isPending,
    flashClosePosition,
    userData,
  } = useEggsData();

  // Use specified token data
  const balance = userData[tokenType].backingBalance;
  const eggs = userData[tokenType].balance;
  const loanData = userData[tokenType].loan;

  const borrowed = loanData ? Number(formatEther(loanData.borrowed)) : 0;
  const collateral = loanData ? Number(formatEther(loanData.collateral)) : 0;
  const { sonic: collateralInSonic } = useConverter(loanData ? loanData.collateral : 0, tokenType);
  const _maxRemovable =
    Number(formatEther(collateralInSonic || BigInt(0))) * 0.99 - borrowed;
  const maxRemovable = _maxRemovable < 0 ? 0 : _maxRemovable;

  const handleClose = async () => {
    if (Number(repayAmount) === borrowed) {
      closePosition(tokenType);
    } else {
      repay(parseEther(repayAmount), tokenType);
    }
  };

  const handleFlashClose = async () => {
    flashClosePosition(tokenType);
  };

  const handleMaxRepay = () => {
    setRepayAmount(borrowed.toString());
  };

  return (
    <Stack
      spacing={3}
      minHeight={"479px"}
      position={"relative"}
      pt={"24px"}
      sx={{ height: '100%' }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Close Position
      </Typography>
      
      {isConfirming || isPending ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <LoadingScreen />
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack spacing={4}>
              <ToggleButtonGroup
                value={closeMethod}
                exclusive
                onChange={(_, value) => value && setCloseMethod(value)}
                fullWidth
                sx={{
                  height: 56,
                  "& .MuiToggleButton-root": {
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    py: 2,
                  },
                }}
              >
                <ToggleButton value="standard">Standard Repay</ToggleButton>
                <ToggleButton value="flash">Flash Close</ToggleButton>
              </ToggleButtonGroup>

              {closeMethod === "standard" ? (
                <Stack spacing={3}>
                  <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                    Required SONIC to Repay
                  </Typography>
                  <TextField
                    label="Repay Amount (SONIC)"
                    type="number"
                    value={repayAmount}
                    size="large"
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= borrowed) {
                        setRepayAmount(e.target.value);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button 
                            onClick={handleMaxRepay} 
                            size="medium"
                            sx={{ fontSize: '1rem', fontWeight: 600 }}
                          >
                            MAX
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      <Typography variant="body1" sx={{ fontSize: '1rem', mt: 1 }}>
                        Max repayable: {nFormatter(borrowed, 2)} SONIC
                      </Typography>
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        height: 64,
                        fontSize: "1.2rem",
                      },
                      "& .MuiInputLabel-root": {
                        fontSize: "1.1rem",
                      },
                    }}
                  />

                  <Alert severity="info" sx={{ fontSize: '1rem', py: 2 }}>
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    {Number(repayAmount) === borrowed ? (
                      <>
                        After repayment, you will receive{" "}
                        {nFormatter(collateral, 2)} EGGS
                      </>
                    ) : (
                      <>
                        Partial repayment of {nFormatter(Number(repayAmount), 2)}{" "}
                        SONIC. Your remaining loan will be{" "}
                        {nFormatter(borrowed - Number(repayAmount), 2)} SONIC
                      </>
                    )}
                    </Typography>
                  </Alert>
                </Stack>
              ) : (
                <Stack spacing={3}>
                  {maxRemovable < 0 ? (
                    <Alert severity="info" sx={{ fontSize: '1rem', py: 2 }}>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        Your collateral value must be 1% higher than your borrowed
                        amount to use this function.
                      </Typography>
                    </Alert>
                  ) : (
                    <Alert severity="warning" sx={{ fontSize: '1rem', py: 2 }}>
                      <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                        Flash close will swap your collateral for SONIC to repay the
                        loan in a single transaction. Using this function result in 1%
                        fee.
                      </Typography>
                    </Alert>
                  )}

                  <Stack spacing={2}>
                    <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
                      Estimated Return
                    </Typography>
                    <Typography variant="h4" sx={{ fontSize: '1.8rem', fontWeight: 700 }}>
                      {nFormatter(maxRemovable, 8)} Sonic
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                      After 1% flash close fee
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            {closeMethod === "standard" ? (
              <Button
                disabled={
                  Number(repayAmount) === 0 ||
                  Number(repayAmount) > borrowed ||
                  Number(repayAmount) > Number(balance?.formatted)
                }
                variant="contained"
                onClick={handleClose}
                color="primary"
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                {Number(repayAmount) === borrowed
                  ? "Repay & Close Position"
                  : "Partial Repay"}
              </Button>
            ) : (
              <Button
                disabled={maxRemovable === 0}
                variant="contained"
                onClick={handleFlashClose}
                color="error"
                fullWidth
                size="large"
                sx={{
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                }}
              >
                Flash Close Position
              </Button>
            )}
          </Box>
        </>
      )}
    </Stack>
  );
};