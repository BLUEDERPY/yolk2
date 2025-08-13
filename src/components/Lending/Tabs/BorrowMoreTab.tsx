import React from "react";
import { Stack, Alert, Typography, Box } from "@mui/material";
import { BorrowInputs } from "../BorrowInputs";
import { CollateralDisplay } from "../CollateralDisplay";
import { FeesDisplay } from "../FeesDisplay";
import { BorrowActions } from "../BorrowActions";
import { useLendingState } from "../hooks/useLendingState";
import { PositionSummary } from "../components/PositionSummary";
import LoadingScreen from "../../LoadingScreen";

export const BorrowMoreTab = ({ 
  tokenType = 'eggs',
  tokenConfig = { tokenName: "EGGS", backingToken: "S", backingTitle: "Sonic" }
}: { 
  tokenType?: 'eggs' | 'yolk' | 'nest';
  tokenConfig?: { tokenName: string; backingToken: string; backingTitle: string };
}) => {
  const {
    borrowAmount,
    setBorrowAmount,
    duration,
    setDuration,
    collateralRequired,
    fees,
    isValid,
    isTransactionOccuring,
    errorMessage,
    handleMaxBorrow,
    handleBorrow,
    balance,
    minDuration,
    max,
  } = useLendingState(tokenType);

  return (
    <Stack spacing={0} minHeight={{ xs: 0, sm: "479px" }} position={"relative"} sx={{ height: '100%' }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: "text.primary" }}>
        Borrow More {tokenConfig.backingTitle}
      </Typography>
      
      {isTransactionOccuring ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <LoadingScreen />
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Stack spacing={3}>
              <BorrowInputs
                max={max}
                setBorrowAmount={setBorrowAmount}
                minDuration={minDuration}
                duration={duration}
                setDuration={setDuration}
                onMaxClick={handleMaxBorrow}
                balance={balance}
              />

              <Box>
                <CollateralDisplay
                  collateralRequired={collateralRequired || 0}
                  borrowAmount={borrowAmount}
                />
                <FeesDisplay fees={fees} duration={duration} />
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <BorrowActions
              isValid={isValid}
              errorMessage={errorMessage}
              onBorrow={handleBorrow}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};
