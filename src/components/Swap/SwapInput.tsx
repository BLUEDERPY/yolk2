import React from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";

interface SwapInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  balance: string;
  onMax?: () => void;
  disabled?: boolean;
}

export const SwapInput: React.FC<SwapInputProps> = ({
  label,
  value,
  onChange,
  balance,
  onMax,
  disabled = false,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Balance: {Number(balance).toFixed(4)}
          </Typography>
          {onMax && (
            <Button
              size="small"
              onClick={onMax}
              sx={{ 
                minWidth: "auto", 
                px: 2, 
                py: 0.5,
                fontWeight: 600,
                fontSize: "0.75rem"
              }}
            >
              MAX
            </Button>
          )}
        </Stack>
      </Stack>
      <TextField
        fullWidth
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        size="medium"
        inputProps={{
          min: 0,
          max: Number(balance),
          step: "any",
        }}
        sx={{
          "& .MuiInputBase-root": {
            height: 56,
            fontSize: "1.1rem",
          },
        }}
      />
    </Box>
  );
};
