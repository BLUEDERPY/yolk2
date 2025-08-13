import React, { useEffect, useState } from "react";
import { Stack, Button, Typography, Link, Box } from "@mui/material";
import { SwapInput } from "./SwapInput";
import { SwapButton } from "./SwapButton";
import { ArrowUpDown } from "lucide-react";

import { formatEther, parseEther } from "viem";

import LoadingScreen from "../LoadingScreen";
import { useEggsData } from "../../providers/data-provider";
import useConverter from "../../hooks/useConverter";

interface SwapFormProps {
  tokenType?: 'eggs' | 'yolk' | 'nest';
  compact?: boolean;
  showMintEndedMessage?: boolean;
}

export const SwapForm: React.FC<SwapFormProps> = ({ 
  tokenType = 'eggs', 
  compact = false,
  showMintEndedMessage = true 
}) => {
  const [fromAmount, setFromAmount] = useState<string>("");
  const [tradeDirection, setTradeDirection] = useState<"buy" | "sell">("buy");

  const {
    userData,
    buy,
    sell,
    isConfirming,
    isPending,
    isSuccess,
  } = useEggsData();

  // Use specified token data from userData
  const tokenBalance = userData[tokenType].balance;
  const backingBalance = userData[tokenType].backingBalance;

  const { sonic: conversionRateToSonic, eggs: conversionRateToEggs } = useConverter(
    parseEther(fromAmount.toString() || "0"), tokenType
  );

  // Format balances based on token type
  const getFormattedBackingBalance = () => {
    if (!backingBalance) return "0";
    
    switch (tokenType) {
      case 'eggs':
        // EGGS uses SONIC (native token)
        return Number(backingBalance.formatted || "0").toFixed(6);
      case 'yolk':
        // YOLK uses USDC
        return Number(backingBalance.formatted || "0").toFixed(6);
      case 'nest':
        // NEST uses EGGS as backing
        return Number(backingBalance.formatted || "0").toFixed(6);
      default:
        return "0";
    }
  };

  const getFormattedTokenBalance = () => {
    if (!tokenBalance) return 0;
    return Number(formatEther(tokenBalance));
  };

  const formattedBackingBalance = getFormattedBackingBalance();
  const formattedTokenBalance = getFormattedTokenBalance();

  const convertedAmount =
    tradeDirection === "buy"
      ? conversionRateToEggs
        ? Number(formatEther(conversionRateToEggs)) * 0.99
        : 0
      : conversionRateToSonic
      ? Number(formatEther(conversionRateToSonic)) * 0.99
      : 0;

  // Get token configuration
  const tokenConfig = {
    eggs: { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" },
    yolk: { tokenName: "YOLK", backingToken: "USDC", backingTitle: "USDC" },
    nest: { tokenName: "NEST", backingToken: "EGGS", backingTitle: "Eggs" },
  }[tokenType];

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleSwapDirection = () => {
    setTradeDirection(tradeDirection === "buy" ? "sell" : "buy");
  };

  const handleTradeSubmit = () => {
    if (tradeDirection === "buy") {
      buy(fromAmount, tokenType);
    } else {
      sell(fromAmount, tokenType);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setFromAmount("");
    }
  }, [isSuccess]);

  if (isConfirming || isPending) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: compact ? '200px' : '300px',
        width: '100%'
      }}>
        <LoadingScreen />
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
      {!compact && showMintEndedMessage && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
            Swap Tokens
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Mint has ended, if you would like to purchase eggs please go to{" "}
            <Link
              target={"_blank"}
              href={
                "https://www.shadow.so/trade?inputCurrency=0x0000000000000000000000000000000000000000&outputCurrency=0xf26Ff70573ddc8a90Bd7865AF8d7d70B8Ff019bC"
              }
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              Shadow Exchange
            </Link>
          </Typography>
        </Box>
      )}

      {compact && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
            Swap Tokens
          </Typography>
        </Box>
      )}

      {!compact && tokenType === 'eggs' && (
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}>
          Sell EGGS
        </Typography>
      )}

      <SwapInput
        tokenType={tokenType}
        label={tradeDirection === "buy" ? tokenConfig.backingTitle : tokenConfig.tokenName}
        value={fromAmount}
        onChange={handleFromAmountChange}
        balance={
          tradeDirection === "buy"
            ? formattedBackingBalance
            : formattedTokenBalance.toString()
        }
        onMax={() =>
          handleFromAmountChange(
            tradeDirection === "buy"
              ? formattedBackingBalance
              : formattedTokenBalance.toString()
          )
        }
      />

      <Button
        onClick={handleSwapDirection}
        sx={{
          width: compact ? "32px" : "48px",
          minWidth: compact ? "32px" : "48px",
          height: compact ? "32px" : "48px",
          p: 0,
          alignSelf: "center",
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "divider",
          "&:hover": {
            borderColor: "primary.main",
            backgroundColor: "primary.main",
            color: "white",
          },
        }}
      >
        <ArrowUpDown size={compact ? 16 : 24} />
      </Button>

      <SwapInput
        tokenType={tokenType}
        label={tradeDirection === "buy" ? tokenConfig.tokenName : tokenConfig.backingTitle}
        value={convertedAmount.toFixed(6)}
        onChange={() => {}}
        balance={
          tradeDirection === "buy"
            ? formattedTokenBalance.toString()
            : formattedBackingBalance
        }
        disabled
      />

      <SwapButton
        onClick={handleTradeSubmit}
        disabled={
          !fromAmount ||
          Number(fromAmount) <= 0 ||
          Number(fromAmount) >
            (tradeDirection === "buy"
              ? Number(formattedBackingBalance)
              : Number(formattedTokenBalance))
        }
      />
    </Stack>
  );
};