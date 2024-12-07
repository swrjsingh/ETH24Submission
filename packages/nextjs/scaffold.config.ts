import * as chains from "viem/chains";

// Define Amoy testnet
const amoy = {
  ...chains.polygonAmoy,
  name: "Polygon Amoy",
  network: "amoy",
} as const;

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [amoy],

  // The interval at which your front-end polls the RPC servers for new data
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
