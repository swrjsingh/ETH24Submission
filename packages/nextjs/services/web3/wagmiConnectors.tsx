import { type WalletList, connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { type Chain } from "viem";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks, walletConnectProjectId } = scaffoldConfig;

const needsInjectedWalletFallback =
  typeof window !== "undefined" && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet;

// Define wallet list with proper typing
const walletList: WalletList = [
  {
    groupName: "Recommended",
    wallets: [
      () => coinbaseWallet({ appName: "ZKonnect" }),
      () => metaMaskWallet({ projectId: walletConnectProjectId }),
      ...(needsInjectedWalletFallback ? [() => injectedWallet()] : []),
    ],
  },
  {
    groupName: "Other Options",
    wallets: [
      () => walletConnectWallet({ projectId: walletConnectProjectId }),
      () => ledgerWallet({ projectId: walletConnectProjectId }),
      () => rainbowWallet({ projectId: walletConnectProjectId }),
    ],
  },
];

/**
 * wagmi connectors for the wagmi context
 */
export const wagmiConnectors = connectorsForWallets(walletList, {
  appName: "ZKonnect",
  projectId: walletConnectProjectId,
});
