import { useEffect, useState } from "react";
import {
  Stack,
  TextField,
  Typography,
  Alert,
  Button,
  InputAdornment,
  Box,
} from "@mui/material";
import { formatEther } from "viem";

import LoadingScreen from "../../LoadingScreen";

import useConverter from "../../../hooks/useConverter";
import { useEggsData } from "../../../providers/data-provider";

export const RemoveCollateralTab = ({ tokenType = 'eggs' }: { tokenType?: 'eggs' | 'yolk' | 'nest' }) => {
  const [removalAmount, setRemovalAmount] = useState("0");

  const {
    userData,
    isSuccess,
    isConfirming,
    isPending,
    removeCollateral,
  } = useEggsData();

  // Use specified token data
  const balance = userData[tokenType].backingBalance;
  const loanData = userData[tokenType].loan;
  const eggs = userData[tokenType].balance;

  const collateral = loanData ? Number(formatEther(loanData.collateral)) : 0;

  const { eggs: borrowedInEggs } = useConverter(loanData ? loanData.borrowed : 0);
  const _maxRemovable =
    collateral * 0.99 - Number(formatEther(borrowedInEggs || "0"));
  const maxRemovable = _maxRemovable > 0 ? _maxRemovable : 0;

  const remainingCollateral = collateral - Number(removalAmount);

  const handleRemove = async () => {
    removeCollateral(removalAmount, tokenType);
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
        Remove Collateral
      </Typography>

      {isConfirming || isPending ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <LoadingScreen />
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack spacing={3}>
              <Stack spacing={2}>
                <TextField
                  type="number"
                  value={removalAmount}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => {
                            setRemovalAmount(maxRemovable);
                          }}
                          size="small"
                        >
                          MAX
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value <= maxRemovable && value >= 0) {
                      setRemovalAmount(e.target.value);
                    }
                  }}
                  fullWidth
                  helperText={`Remaining collateral: ${remainingCollateral.toFixed(
                    2
                  )} EGGS`}
                />
              </Stack>
              <Alert severity="info">
                Maximum removable amount: {maxRemovable.toFixed(2)} EGGS
              </Alert>
            </Stack>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="contained"
              onClick={handleRemove}
              disabled={
                Number(removalAmount) <= 0 || Number(removalAmount) > maxRemovable
              }
              fullWidth
            >
              Remove {removalAmount} EGGS
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};
