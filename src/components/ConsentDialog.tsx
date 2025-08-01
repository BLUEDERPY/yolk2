import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  Link,
  Divider,
  Typography,
  Box,
} from "@mui/material";

export const ConsentDialog = () => {
  const [open, setOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [risksAccepted, setRisksAccepted] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasConsented = localStorage.getItem("eggsUserConsent");
    const isHomePage = location.pathname === "/";
    if (!hasConsented && !isHomePage) {
      setOpen(true);
    }
  }, [location.pathname]);

  const handleClose = () => {
    if (termsAccepted && risksAccepted) {
      if (dontShowAgain) {
        localStorage.setItem("eggsUserConsent", "true");
      }
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>Important Notice</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please read and acknowledge the following before proceeding
          </Alert>

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
            }
            label={
              <Typography>
                I have read and agree to the{" "}
                <Link
                  href="https://eggs-finance.gitbook.io/docs/disclaimer"
                  target="_blank"
                  rel="noopener"
                >
                  terms and conditions
                </Link>
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={risksAccepted}
                onChange={(e) => setRisksAccepted(e.target.checked)}
              />
            }
            label="I understand lending and leverage carry liquidation risk and some or all of my funds may be lost"
          />

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="caption" color="text.secondary">
                  Don't show this message again
                </Typography>
              }
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={!termsAccepted || !risksAccepted}
          onClick={handleClose}
          fullWidth
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
