import React, { useEffect, useState } from "react";
import { Stack, Button, Typography, Link } from "@mui/material";
import { SwapInput } from "./SwapInput";
import { SwapButton } from "./SwapButton";
import { ArrowUpDown } from "lucide-react";

import { formatEther, parseEther } from "viem";

import LoadingScreen from "../LoadingScreen";
import { useEggsData } from "../../providers/data-provider";
import useConverter from "../../hooks/useConverter";

export const SwapForm: React.FC<{ tokenType?: 'eggs' | 'yolk' | 'nest' }> = ({ tokenType = 'eggs' }) => {
  const [fromAmount, setFromAmount] = useState<string>("");
  //const [toAmount, setToAmount] = useState<string>("");
  const [isEggsToSonic, setIsEggsToSonic] = useState(true);

  const {
    userData,
    buy,
    sell,
    isConfirming,
    isPending,
    isSuccess,
    isMintedOut,
  } = useEggsData();

  // Use specified token data
  const eggsBalance = userData[tokenType].balance;
  const balance = userData[tokenType].backingBalance;

  const { sonic: conversionRateToSonic, eggs: conversionRate } = useConverter(
    parseEther(fromAmount.toString() || "0")
  );

  const sonicBalance = balance ? Number(balance.formatted).toFixed(6) : "0";
  const eggsBalanceFormatted = Number(formatEther(eggsBalance || "0"));

  /* const { data: conversionRateToSonic } = useEggsToSonic(
    parseEther(fromAmount.toString() || "0")
  );*/

  const toAmount =
    conversionRate && conversionRateToSonic
      ? (
          Number(
            formatEther(isEggsToSonic ? conversionRateToSonic : conversionRate)
          ) * 0.975
        ).toFixed(6)
      : "";

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleSwapDirection = () => {};
  const handleBuy = () => {
    buy(fromAmount, tokenType);
  };
  const handleSell = () => {
    sell(fromAmount, tokenType);
  };

  useEffect(() => {
    if (isSuccess) {
      setFromAmount("");
    }
  }, [isSuccess]);

  return (
    <Stack 
      spacing={3} 
      sx={{ 
        minHeight: 575, 
        flex: 1,
        justifyContent: "center",
        py: { xs: "24px", sm: "30px" },
        px: { xs: "24px", sm: 6, md: 8 },
      }}
    >
      {isConfirming || isPending ? (
        <LoadingScreen />
      ) : (
        <>
          <Stack spacing={3} sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Swap Tokens
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
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
            <Divider sx={{ mb: 3 }} />
            <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 600 }}>
              Sell EGGS
            </Typography>

            <Stack spacing={3} sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
            <SwapInput
              label={isEggsToSonic ? "EGGS" : "S"}
              value={fromAmount}
              onChange={handleFromAmountChange}
              balance={isEggsToSonic ? eggsBalanceFormatted : sonicBalance}
              onMax={() =>
                handleFromAmountChange(
                  isEggsToSonic ? eggsBalanceFormatted : sonicBalance
                )
              }
            />
            <Button
              onClick={handleSwapDirection}
              sx={{
                width: "48px",
                minWidth: "48px",
                height: "48px",
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
              <ArrowUpDown size={24} />
            </Button>
            <SwapInput
              label={isEggsToSonic ? "S" : "EGGS"}
              value={toAmount}
              onChange={() => {}}
              balance={isEggsToSonic ? sonicBalance : eggsBalanceFormatted}
              disabled
            />

            <SwapButton
              onClick={isEggsToSonic ? handleSell : handleBuy}
              disabled={
                !fromAmount ||
                Number(fromAmount) <= 0 ||
                Number(fromAmount) >
                  (isEggsToSonic
                    ? Number(eggsBalanceFormatted)
                    : Number(sonicBalance))
              }
            />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
