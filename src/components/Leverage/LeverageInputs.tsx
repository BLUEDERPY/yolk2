import React from "react";
import {
  Stack,
  Typography,
  TextField,
  Slider,
  Box,
  InputAdornment,
  Button,
  Alert,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import { formatDate, nFormatter } from "../../utils/formatters";
import useleverage from "../hooks/useLeverage";
import { parseEther } from "viem";
import { InfoIcon } from "lucide-react";
import { useEggsData } from "../../providers/data-provider";

interface LeverageInputsProps {
  sonicAmount: string;
  setSonicAmount: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  loanFee: number;
  loanFeeWithOverCol: number;
  requiredEggs: number;
  sonicBalance: string;
  onMaxClick: () => void;
  handleLeveragePosition: () => void;
  tokenType?: 'eggs' | 'yolk' | 'nest';
}

export const LeverageInputs = ({
  sonicAmount,
  setSonicAmount,
  duration,
  setDuration,
  loanFee,
  loanFeeWithOverCol,
  requiredEggs,
  sonicBalance,
  onMaxClick,
  handleLeveragePosition,
  tokenType = 'eggs',
}: LeverageInputsProps) => {
  const isValidInput =
    Number(sonicAmount) > 0 && duration >= 0 && duration <= 365;
  const today = new Date();
  const _endDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) +
      Number(duration + 1 || 1) * 24 * 60 * 60 * 1000
  );
  const { userData } = useEggsData();
  
  const sonic = userData[tokenType].backingBalance;
  const eggsBalance = userData[tokenType].balance;
  console.log(tokenType);
  return (
    <Stack
      spacing={3}
      sx={{
        py: { xs: "24px", sm: "30px" },
        px: { xs: "24px", sm: 6, md: 8 },
        minHeight: 575,
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Open Leverage Position
        </Typography>
        
        <Stack spacing={3}>
          {/* Loan Duration */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Loan Duration: {duration} days
            </Typography>
            <Slider
              value={duration}
              onChange={(_, value) => setDuration(value as number)}
              min={1}
              max={365}
              valueLabelDisplay="auto"
              sx={{ mb: 0, pb: 0 }}
            />
          </Box>

          {/* SONIC Amount */}
          <Box>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Amount of S to Borrow
            </Typography>
            <TextField
              type="number"
              value={sonicAmount}
              onChange={(e) => setSonicAmount(e.target.value)}
              fullWidth
              size="medium"
              InputProps={{
                inputProps: { min: 0 },
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
              sx={{
                "& .MuiInputBase-root": {
                  height: 56,
                },
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            Total Borrowed
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
            {nFormatter(Number(sonicAmount) * 0.99 - loanFee, 2)} S
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, py: 1 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
            Total Collateral
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
            {nFormatter(requiredEggs, 2)} EGGS
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              Expiration Date
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {formatDate(_endDate)}{" "}
            {_endDate.toLocaleTimeString().replace(/:\d+ /, " ")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 2,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "action.hover",
            borderRadius: 1,
            px: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              You Pay{" "}
              <Tooltip
                sx={{ display: "inline" }}
                title={
                  "This is the total cost you pay to open the position seen here. This fee is non-refundable and may be lost if the price of EGGS does not increase before your expiry date."
                }
              >
                <InfoIcon height={15} width={15} />
              </Tooltip>
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
            {nFormatter(loanFeeWithOverCol, 4)} S
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Make sure you understand the risks of leveraged positions before
          proceeding.
        </Alert>
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleLeveragePosition}
          disabled={!isValidInput}
          sx={{
            py: 1.5,
            height: "auto",
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          Open Leverage Position
        </Button>
      </Box>
    </Stack>
  );
};
