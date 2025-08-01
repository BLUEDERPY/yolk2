import React, { useEffect, useState } from "react";
import {
  Card,
  Box,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Stack,
} from "@mui/material";

import { formatEther, parseEther } from "viem";
import { LeverageInputs } from "./LeverageInputs";
import { PotentialReturns } from "./PotentialReturns";
import {
  getleverageFee,
  getMaxEggsFromFee,
} from "../../utils/leverageCalculations";

import { LoanMetrics } from "../Lending/Sidebar/LoanMetrics";
import { LendingTabs } from "../Lending/LendingTabs";
import { useTheme } from "@mui/material/styles";
import LoadingScreen from "../LoadingScreen";
import { useEggsData } from "../../providers/data-provider";
import useConverter from "../../hooks/useConverter";
import { auroraColors, auroraBorderRadius } from "../../themes/aurora";

export const LeverageCalculator = ({ tokenType = 'eggs' }: { tokenType?: 'eggs' | 'yolk' | 'nest' }) => {
  const theme = useTheme();
  const [_sonicAmount, setSonicAmount] = useState("0");
  const sonicAmount = Number(_sonicAmount) >= 0 ? _sonicAmount : "0";
  const [duration, setDuration] = useState<number>(1);
  const {
    userData,
    isPending,
    isConfirming,
    leverage,
    estimatedGas,
  } = useEggsData();
  
  // Use specified token data
  const balance = userData[tokenType].backingBalance;
  const loan = userData[tokenType].loan;
  
  const sonicBalance = balance ? balance.formatted : "0";

  const { sonic: conversionRate } = useConverter(parseEther("1"));
  const eggsPerSonic = conversionRate ? Number(formatEther(conversionRate)) : 0;
  const { fee, feeWithOverCol } = getleverageFee(
    parseEther(sonicAmount || "0"),
    duration
  );

  const { eggs: _requiredEggs } = useConverter(
    parseEther(sonicAmount) -
      (feeWithOverCol * BigInt(1e18) -
        (fee * BigInt(1e18) * BigInt(3)) / BigInt(10)) /
        BigInt(1e18)
  );
  const requiredEggs = _requiredEggs ? Number(formatEther(_requiredEggs)) : 0;

  const { eggs: _eggsBal } = useConverter(balance?.value || parseEther("0"));

  const max = getMaxEggsFromFee(
    balance?.value || BigInt(0),
    duration,
    estimatedGas || parseEther(".01")
  );
  //// // console.log(fee);
  const loanFee = fee ? Number(formatEther(fee)) : 0;
  const loanFeeWithOverCol = fee ? Number(formatEther(feeWithOverCol)) : 0;

  const leverageX = Number(sonicAmount) / loanFee;

  const handleLeveragePosition = async () => {
    leverage(parseEther(sonicAmount), duration, feeWithOverCol, tokenType);
  };

  useEffect(() => {
    if (fee > balance?.value)
      setSonicAmount(Number(formatEther(max || "0")).toString());
  }, [duration, max, fee, balance]);

  const handleMaxClick = () => {
    setSonicAmount(Number(formatEther(max || "0")).toString());
  };

  const calculateROI = (priceIncrease: number) => {
    const initialCollateralValue = requiredEggs;
    const newCollateralValue = requiredEggs * (1 + priceIncrease);
    const borrowedValue = Number(sonicAmount) / eggsPerSonic;
    const roi =
      ((newCollateralValue - initialCollateralValue) / initialCollateralValue) *
      100;
    const profit =
      (newCollateralValue * roi - newCollateralValue * 100) / 10000 - loanFee;

    return { profit: profit / 100, roi };
  };

  const getScenstio = (incre) => {
    if (incre && fee)
      return (incre * Number(sonicAmount)) / Number(formatEther(fee)) / 100;
  };

  const scenarios = [
    { increase: getScenstio(5), label: "5%" },
    { increase: getScenstio(25), label: "25%" },
    { increase: getScenstio(100), label: "100%" },
    { increase: getScenstio(1000), label: "1000%" },
  ].map((scenario) => ({
    label: scenario.label,
    ...calculateROI(scenario.increase),
  }));

  return (
    <Box
      sx={{
        p: 0,

        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {loan &&
      loan.borrowed &&
      new Date(Number(loan.endDate) * 1000) <= new Date() ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
            gap: 0,
          }}
        >
          {/* Borrow More Section */}

          <LendingTabs tokenType={tokenType} />

          {/* Close Position Dialog */}

          <Box
            sx={{
              borderLeft: {
                xs: "none",
                md:
                  theme.palette.mode === "light"
                    ? "1px dotted rgba(0,0,0,0.1)"
                    : "1px dotted rgba(255,255,255,0.1)",
              },
              //borderTop: { xs: 1, md: "none" },
              //borderRadius: { sm: "0 16px 16px 0" },
              //m: "1px",
              //borderColor: `${theme.palette.primary.dark} !important`,
              px: { xs: 0, sm: 4, md: 2 },
              pt: { xs: 3, md: 0 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <LoanMetrics tokenType={tokenType} />
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 400px" },
            height: 575,
            gap: 0,
          }}
        >
          {isPending || isConfirming ? (
            <Stack spacing={3} height={575} justifyContent={"center"}>
              <LoadingScreen />
            </Stack>
          ) : (
            <LeverageInputs
              sonicAmount={sonicAmount}
              setSonicAmount={setSonicAmount}
              duration={duration}
              setDuration={setDuration}
              loanFeeWithOverCol={loanFeeWithOverCol}
              loanFee={loanFee}
              requiredEggs={requiredEggs}
              eggsPerSonic={eggsPerSonic}
              sonicBalance={sonicBalance}
              onMaxClick={handleMaxClick}
              handleLeveragePosition={handleLeveragePosition}
              tokenType={tokenType}
            />
          )}
          <Box
            sx={{
              backdropFilter: "blur(20px)",
              borderLeft: {
                xs: "none",
                md:
                  theme.palette.mode === "light"
                    ? "1px dotted rgba(0,0,0,0.1)"
                    : "1px dotted rgba(255,255,255,0.1)",
              },

              px: { xs: 0, sm: 4, md: 2 },
              pt: { xs: 3, md: 0 },
              display: "flex",
              height: "100%",
            }}
          >
            <PotentialReturns
              leverageX={leverageX}
              borrowAmount={Number(sonicAmount)}
              scenarios={scenarios}
              fee={loanFee}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
