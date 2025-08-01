import React, { useState } from "react";
import {
  Stack,
  TextField,
  Button,
  InputAdornment,
  Typography,
  Grid,
  Slider,
  Box,
  Paper,
} from "@mui/material";
import { formatEther, parseEther } from "viem";
import { useEggsData } from "../../providers/data-provider";

interface BorrowInputsProps {
  max: string;
  setBorrowAmount: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  onMaxClick: () => void;
  balance: string;
  minDuration: number;
  tokenConfig?: {
    tokenName: string;
    backingToken: string;
    backingTitle: string;
  };
}

export const BorrowInputs: React.FC<BorrowInputsProps> = ({
  max,
  setBorrowAmount,
  duration,
  setDuration,
  balance,
  minDuration,
  tokenConfig = { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" },
}) => {
  const { userSonicBalance: sonic, userLoan } = useEggsData();
  const hasLoan = userLoan && new Date(Number(userLoan[2]) * 1000) < new Date();

  const [borrow, setBorrow] = useState("0");

  const onChange = (_amount) => {
    setBorrowAmount(parseEther(_amount.toString()));
    setBorrow(_amount);
  };
  const maxNumber = Number(formatEther(max || 0));

  const onMaxClick = (_amount) => {
    setBorrowAmount(max);
    setBorrow(maxNumber.toString());
  };

  return (
    <Stack spacing={3} position={"relative"}>
      <Stack spacing={3}>
        {hasLoan && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Loan Duration: {duration} days
            </Typography>

            <Slider
              value={duration}
              onChange={(_, value) => setDuration(value as number)}
              min={0}
              max={365}
              sx={{ mt: 2 }}
            />
          </Box>
        )}
        <TextField
          label="Amount to Borrow"
          type="number"
          value={maxNumber < Number(borrow) ? maxNumber.toString() : borrow}
          onChange={(e) => {
            if (Number(e.target.value) >= 0) onChange(e.target.value);
            else onChange("0");
          }}
          size="medium"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  onClick={onMaxClick} 
                  size="small"
                  sx={{ 
                    minWidth: "auto",
                    px: 2,
                    fontWeight: 600,
                  }}
                >
                  MAX
                </Button>
              </InputAdornment>
            ),
          }}
          helperText={`Enter the amount of ${tokenConfig.backingTitle} tokens you want to borrow`}
          sx={{
            "& .MuiInputBase-root": {
              height: 56,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};
