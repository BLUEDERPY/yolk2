import React from "react";
import { Stack, Typography, Box, Paper, Chip } from "@mui/material";
import { formatEther } from "viem";
import { nFormatter } from "../../utils/formatters";
import { useTheme } from "@mui/material/styles";
import { Wallet, Coins } from "lucide-react";

interface BalancesWidgetProps {
  sonic: any;
  eggs: bigint | undefined;
  tokenConfig?: {
    tokenName: string;
    backingToken: string;
    backingTitle: string;
  };
}

export const BalancesWidget: React.FC<BalancesWidgetProps> = ({ 
  sonic, 
  eggs, 
  tokenConfig = { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" }
}) => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)'
          : 'rgba(17, 17, 17, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        minWidth: 'fit-content',
      }}
    >
      {/* EGGS Balance */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.warning.main}40 0%, ${theme.palette.warning.main}20 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Coins size={12} color={theme.palette.warning.main} />
        </Box>
        <Box>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.65rem',
              fontWeight: 500,
              color: 'text.secondary',
              lineHeight: 1,
              display: 'block'
            }}
          >
            {tokenConfig.tokenName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1,
              color: 'text.primary'
            }}
          >
            {nFormatter(Number(formatEther(eggs || "0")), 2)}
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: 1,
          height: 32,
          background: theme.palette.divider,
          borderRadius: 0.5,
        }}
      />

      {/* SONIC Balance */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}40 0%, ${theme.palette.primary.main}20 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Wallet size={12} color={theme.palette.primary.main} />
        </Box>
        <Box>
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.65rem',
              fontWeight: 500,
              color: 'text.secondary',
              lineHeight: 1,
              display: 'block'
            }}
          >
            {tokenConfig.backingTitle}
          </Typography>
          <Typography
            variant="body2"
            sx={{ 
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 600,
              lineHeight: 1,
              color: 'text.primary'
            }}
          >
            {nFormatter(Number(sonic?.formatted || "0"), 2)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};