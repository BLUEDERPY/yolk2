import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GlobalProvider } from "./providers/global-provider.tsx";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
const queryClient = new QueryClient();
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider";
import { EggsProvider } from "./providers/data-provider.tsx";
import { Buffer } from "buffer";
import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets, WalletList } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  ledgerWallet,
  rabbyWallet,
  safeWallet,
  trustWallet,
  uniswapWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import binanceWallet from "@binance/w3w-rainbow-connector-v2";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { sepolia } from "wagmi/chains";
import { ChartDataProvider } from "./providers/chart-data-provider.tsx";
const WALLET_CONNECT_PROJECT_ID = "3fbb6bba6f1de962d911bb5b5c9dba88";
const APP_NAME = "Eggs";

const recommendedWalletList: WalletList = [
  {
    groupName: "Recommended",
    wallets: [
      binanceWallet,
      rainbowWallet,
      walletConnectWallet,
      rabbyWallet,
      safeWallet,
      coinbaseWallet,
      uniswapWallet,
      trustWallet,
      ledgerWallet,
    ],
  },
];
const connectors = connectorsForWallets(recommendedWalletList, {
  projectId: WALLET_CONNECT_PROJECT_ID,
  appName: APP_NAME,
});

const config = createConfig({
  ssr: false,
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultMode="dark">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <GlobalProvider>
            <RainbowKitProvider>
              <ChartDataProvider>
                <EggsProvider>
                  <App />
                </EggsProvider>
              </ChartDataProvider>
            </RainbowKitProvider>
          </GlobalProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  </React.StrictMode>
);
