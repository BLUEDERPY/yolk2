import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BorrowInputs } from "./BorrowInputs";
import { CollateralDisplay } from "./CollateralDisplay";
import { FeesDisplay } from "./FeesDisplay";
import { BorrowActions } from "./BorrowActions";
import { useLendingState } from "./hooks/useLendingState";
import LoadingScreen from "../LoadingScreen";
import { LoanMetrics } from "./Sidebar/LoanMetrics";
import { formatEther } from "viem";
import theme from "../../themes";
import { AlertTriangle } from "lucide-react";
import { LendingTabs } from "./LendingTabs";
import { useEggsData } from "../../providers/data-provider";

export const LendingInterface: React.FC<{ tokenType?: 'eggs' | 'yolk' | 'nest' }> = ({ tokenType = 'eggs' }) => {
  const {
    borrowAmount,
    setBorrowAmount,
    duration,
    setDuration,
    collateralRequired,
    fees,
    isValid,
    errorMessage,
    handleMaxBorrow,
    handleBorrow,
    isTransactionOccuring,
    balance,
    onRepay,
    onExtend,
    onClose,
    max,
  } = useLendingState(tokenType);
  const { userLoan } = useEggsData();

  const borrowedSonic = userLoan && userLoan.borrowed ? Number(formatEther(userLoan.borrowed)) : 0;

  const hasPosition = borrowedSonic > 0;

  const [extendDays, setExtendDays] = useState(7);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const handleExtendChange = (_: Event, newValue: number | number[]) => {
    setExtendDays(newValue as number);
  };

  return (
    <Card
      sx={{
        p: 0,
        width: {
          xs: "calc(100dvw - 30px)",
          sm: "550px",
          md: hasPosition ? "900px" : "550px",
        },
        borderRadius: { sm: "16px" },
        minHeight: {
          xs: "0px",
          sm: "575px",
        },
        position: "relative",
      }}
    >
      {hasPosition ? (
        <Box
          sx={{
            // maxWidth: "100px",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
            gap: 0,
          }}
        >
          {/* Borrow More Section */}

          <LendingTabs tokenType={tokenType} />

          {/* Close Position Dialog */}
          <Dialog
            open={showCloseDialog}
            onClose={() => setShowCloseDialog(false)}
          >
            <DialogTitle>Confirm Close Position</DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Closing your position will incur a 1% fee on the total position
                value.
              </Alert>
              <Typography>
                Are you sure you want to close your position? This action cannot
                be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCloseDialog(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  onClose();
                  setShowCloseDialog(false);
                }}
                color="error"
                variant="contained"
              >
                Close Position
              </Button>
            </DialogActions>
          </Dialog>

          <Box
            sx={{
              //borderLeft: { xs: "none", md: 1 },
              //borderTop: { xs: 1, md: "none" },
              //borderRadius: { sm: "0 16px 16px 0" },
              //m: "1px",
              //borderColor: `${theme.palette.primary.dark} !important`,
              background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`,
              px: { xs: 0, sm: 4, md: 2 },
              pt: { xs: 3, md: 0 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <LoanMetrics tokenType={tokenType} />
          </Box>
        </Box>
      ) : isTransactionOccuring ? (
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
          <LoadingScreen />
        </Stack>
      ) : (
        <Stack
          sx={{
            py: { xs: "24px", sm: "30px" }, 
            px: { xs: "24px", sm: 6, md: 8 },
            minHeight: 575,
            justifyContent: "space-between",
          }}
          spacing={3}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Borrow SONIC
          </Typography>
          
          <BorrowInputs
            max={max}
            setBorrowAmount={setBorrowAmount}
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
          
          <Box sx={{ mt: "auto" }}>
            <BorrowActions
              isValid={isValid}
              errorMessage={errorMessage}
              onBorrow={handleBorrow}
            />
          </Box>
        </Stack>
      )}
    </Card>
  );
};
