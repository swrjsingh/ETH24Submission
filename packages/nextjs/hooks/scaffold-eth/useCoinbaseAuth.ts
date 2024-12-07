import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Connector } from "wagmi";

export const useCoinbaseAuth = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Connect to Coinbase Wallet
  const connectToCoinbase = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      // Find the Coinbase Wallet connector
      const coinbaseConnector = connectors.find(
        (c: Connector) => c.id.toLowerCase() === "coinbasewallet" || c.name.toLowerCase().includes("coinbase"),
      );

      if (!coinbaseConnector) {
        throw new Error("Coinbase Wallet connector not found");
      }

      await connect({ connector: coinbaseConnector });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to connect"));
      console.error("Coinbase connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  // Auto-connect if previously connected
  useEffect(() => {
    if (!isConnected && localStorage.getItem("previouslyConnected") === "true") {
      connectToCoinbase();
    }
  }, []);

  // Save connection state
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem("previouslyConnected", "true");
    } else {
      localStorage.removeItem("previouslyConnected");
    }
  }, [isConnected]);

  return {
    address,
    isConnected,
    isConnecting,
    error,
    connectToCoinbase,
    disconnectWallet,
  };
};
