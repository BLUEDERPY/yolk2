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

export const RemoveCollateralTab = ({ 
  tokenType = 'eggs',
  tokenConfig = { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" }
}: { 
  tokenType?: 'eggs' | 'yolk' | 'nest';
  tokenConfig?: { tokenName: string; backingToken: string; backingTitle: string };
}) => {
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

  const { eggs: borrowedInEggs } = useConverter(loanData ? loanData.borrowed : 0, tokenType);
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
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}>
        Remove Collateral
      </Typography>

      {isConfirming || isPending ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <LoadingScreen />
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <TextField
                  label={`Amount to Remove (${tokenConfig.tokenName})`}
                  type="number"
                  value={removalAmount}
                  size="large"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => {
                            setRemovalAmount(maxRemovable);
                          }}
                          size="medium"
                          sx={{ fontSize: '1rem', fontWeight: 600 }}
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
                  helperText={
                    <Typography variant="body1" sx={{ fontSize: '1rem', mt: 1 }}>
                      Remaining collateral: {remainingCollateral.toFixed(2)} {tokenConfig.tokenName}
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
              </Stack>
              <Alert severity="info" sx={{ fontSize: '1rem', py: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                  Maximum removable amount: {maxRemovable.toFixed(2)} {tokenConfig.tokenName}
                </Typography>
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
              size="large"
              sx={{
                py: 2,
                fontSize: "1.2rem",
                fontWeight: 600,
              }}
            >
              Remove {removalAmount} {tokenConfig.tokenName}
            </Button>
          </Box>
        </>
      )}
    </Stack>
  );
};