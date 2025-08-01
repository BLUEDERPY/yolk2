/*import {
  createConfig,
  http,
  createStorage,
  fallback,
  usePublicClient,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";
import {
  metaMask,
  walletConnect,
  injected,
  coinbaseWallet,
} from "wagmi/connectors";
import { webSocket, type Chain } from "viem";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";

/*export const config = createConfig({
  chains: [mainnet, localhost],
  connectors: [
    walletConnect({ projectId: "3fbb6bba6f1de962d911bb5b5c9dba88" }),
    metaMask(),
  ],
  client: () => viemClient,
});
const connector = getWagmiConnectorV2();

export const sonic: Chain = {
  id: 146,
  name: "Sonic Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Sonic",
    symbol: "S",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.soniclabs.com"],
    },
  },
  blockExplorers: {
    default: { name: "SonicScan", url: "https://sonicscan.org" },
    snowtrace: { name: "SonicScan", url: "https://sonicscan.org" },
  },
  testnet: false,
};

const _config = getDefaultConfig({
  // Your dApps chains
  chains: [sonic],
  storage: createStorage({ storage: window.localStorage }),
  transports: {
    [sonic.id]: fallback([
      http("https://rpc.soniclabs.com"),
      http(
        `https://lb.drpc.org/ogrpc?network=sonic&dkey=ArZPtKods0pmikX1e-67j-FqNHj_6Y0R760-qi5fk9AX`
      ),
      http(
        `https://sonic-mainnet.g.alchemy.com/v2/cC7BG_0xrnq5R9Z0_RNduDlfZpVffOLM`
      ),
    ]),
  },

  // Required API Keys
  walletConnectProjectId: "3fbb6bba6f1de962d911bb5b5c9dba88",

  // Required App Info
  appName: "LoopDaWoop",
});
export const config = createConfig({
  ..._config,
  connectors: [connector(), ..._config.connectors],
});
*/
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  http,
  createConfig,
  WagmiProvider,
  fallback,
  createStorage,
} from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";
import { bsc, Chain, mainnet, sepolia } from "wagmi/chains";
import { getDefaultConfig } from "connectkit";

const connector = getWagmiConnectorV2();
export const sonic: Chain = {
  id: 146,
  name: "Sonic Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Sonic",
    symbol: "S",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.soniclabs.com"],
    },
  },
  blockExplorers: {
    default: { name: "SonicScan", url: "https://sonicscan.org" },
    snowtrace: { name: "SonicScan", url: "https://sonicscan.org" },
  },
  testnet: false,
};

export const _config = getDefaultConfig({
  walletConnectProjectId: "3fbb6bba6f1de962d911bb5b5c9dba88",
  storage: createStorage({ storage: window.localStorage }),

  // Required App Info
  appName: "LoopDaWoop",
  chains: [sonic],
  transports: {
    [sonic.id]: fallback([
      http("https://rpc.soniclabs.com"),
      http(
        `https://lb.drpc.org/ogrpc?network=sonic&dkey=ArZPtKods0pmikX1e-67j-FqNHj_6Y0R760-qi5fk9AX`
      ),
      http(
        `https://sonic-mainnet.g.alchemy.com/v2/cC7BG_0xrnq5R9Z0_RNduDlfZpVffOLM`
      ),
    ]),
    [bsc.id]: http(),
  },
});

export const config = createConfig({
  ..._config,
  connectors: [
    ..._config.connectors,
    injected(),
    connector(),
    coinbaseWallet(),
  ],
});
