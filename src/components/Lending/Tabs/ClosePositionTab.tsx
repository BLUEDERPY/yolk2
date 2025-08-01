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

export const ClosePositionTab = () => {
  const [closeMethod, setCloseMethod] = useState<CloseMethod>("standard");
  const [repayAmount, setRepayAmount] = useState<string>("0");

  const {
    closePosition,
    repay,
    isConfirming,
    isPending,
    flashClosePosition,
    userSonicBalance: balance,
    userEggsBalance: eggs,
    userLoan: loanData,
  } = useEggsData();

  const borrowed = loanData ? Number(formatEther(loanData[1])) : 0;
  const collateral = loanData ? Number(formatEther(loanData[0])) : 0;
  const { sonic: collateralInSonic } = useConverter(loanData ? loanData[0] : 0);
  const _maxRemovable =
    Number(formatEther(collateralInSonic || BigInt(0))) * 0.99 - borrowed;
  const maxRemovable = _maxRemovable < 0 ? 0 : _maxRemovable;

  const handleClose = async () => {
    if (Number(repayAmount) === borrowed) {
      closePosition();
    } else {
      repay(parseEther(repayAmount));
    }
  };

  const handleFlashClose = async () => {
    flashClosePosition();
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
            <Stack spacing={3}>
              <ToggleButtonGroup
                value={closeMethod}
                exclusive
                onChange={(_, value) => value && setCloseMethod(value)}
                fullWidth
              >
                <ToggleButton value="standard">Standard Repay</ToggleButton>
                <ToggleButton value="flash">Flash Close</ToggleButton>
              </ToggleButtonGroup>

              {closeMethod === "standard" ? (
                <Stack spacing={2}>
                  <Typography variant="subtitle2">
                    Required SONIC to Repay
                  </Typography>
                  <TextField
                    type="number"
                    value={repayAmount}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0 && value <= borrowed) {
                        setRepayAmount(e.target.value);
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button onClick={handleMaxRepay} size="small">
                            MAX
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    helperText={`Max repayable: ${nFormatter(borrowed, 2)} SONIC`}
                  />

                  <Alert severity="info">
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
                  </Alert>
                </Stack>
              ) : (
                <Stack spacing={2}>
                  {maxRemovable < 0 ? (
                    <Alert severity="info">
                      Your collateral value must be 1% higher than your borrowed
                      amount to use this function.
                    </Alert>
                  ) : (
                    <Alert severity="warning">
                      Flash close will swap your collateral for SONIC to repay the
                      loan in a single transaction. Using this function result in 1%
                      fee.
                    </Alert>
                  )}

                  <Stack spacing={0}>
                    <Typography variant="subtitle2">Estimated Return</Typography>
                    <Typography variant="h6">
                      {nFormatter(maxRemovable, 8)} Sonic
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
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