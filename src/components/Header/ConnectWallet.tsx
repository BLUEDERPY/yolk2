import { Button } from "@mui/material";
import { Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const name = account?.ensName ? account.ensName : account?.displayName;
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <>
            <Button
              onClick={connected ? openAccountModal : openConnectModal}
              variant="contained"
              color="primary"
              startIcon={<Wallet size={16} />}
              sx={{
                py: 0,
                marginY: "10px",
                height: "35px",
                display: { xs: "none", sm: "flex" },

                "&:hover": {
                  bgcolor: "secondary.main",
                  color: "background.paper",
                },
              }}
            >
              {connected ? name : "Connect Wallet"}
            </Button>
            <Button
              onClick={connected ? openAccountModal : openConnectModal}
              variant="contained"
              color="primary"
              sx={{
                p: "0 !important",

                display: { xs: "flex", sm: "none" },
                position: "fixed",
                right: "10px",
                minWidth: 50,
                top: "8px",
                height: 40,
                width: 30,

                "&:hover": {
                  bgcolor: "secondary.main",
                  color: "background.paper",
                },
              }}
            >
              <Wallet size={24} />
            </Button>
          </>
        );
      }}
    </ConnectButton.Custom>
  );
};
