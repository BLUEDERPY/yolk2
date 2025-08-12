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

  // Use specified token data
  const eggsBalance = userData[tokenType].balance;
  const balance = userData[tokenType].backingBalance;

  const { sonic: conversionRateToSonic, eggs: conversionRateToEggs } = useConverter(
    parseEther(fromAmount.toString() || "0"), tokenType
  );

  const sonicBalance = balance ? Number(balance.formatted).toFixed(6) : "0";
  const eggsBalanceFormatted = Number(formatEther(eggsBalance || "0"));

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
      {!compact && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Swap Tokens
          </Typography>
          {showMintEndedMessage && (
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
          )}
        </Box>
      )}

      {!compact && tokenType === 'eggs' && (
        <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 600 }}>
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
            ? sonicBalance
            : eggsBalanceFormatted.toString()
        }
        onMax={() =>
          handleFromAmountChange(
            tradeDirection === "buy"
              ? sonicBalance
              : eggsBalanceFormatted.toString()
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
            ? eggsBalanceFormatted.toString()
            : sonicBalance
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
              ? Number(sonicBalance)
              : Number(eggsBalanceFormatted))
        }
      />
    </Stack>
  );
};