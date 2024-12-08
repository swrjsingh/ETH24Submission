"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { sha256 } from "js-sha256";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface PurchaseTicketProps {
  eventId: string;
  ticketPrice: string;
  onSuccess?: () => void;
  onClose: () => void;
}

export const PurchaseTicket = ({ eventId, ticketPrice, onSuccess, onClose }: PurchaseTicketProps) => {
  const { address, isConnected } = useAccount();
  const [userDetails, setUserDetails] = useState({
    aadhar: "",
    creditCard: "",
    cvv: "",
  });

  const { writeAsync: issueTicket, isLoading: isIssuing } = useScaffoldContractWrite({
    contractName: "IssueTicket",
    functionName: "issueTicket",
    value: parseEther(ticketPrice),
    args: [
      "0x" + "0".repeat(64), // Placeholder for hash1
      "0x" + "0".repeat(64), // Placeholder for hash2
      BigInt(0), // Placeholder for eventId
    ],
    onSuccess: () => {
      notification.success("Ticket purchased successfully!");
      onSuccess?.();
      onClose();
    },
    onError: (error: Error) => {
      console.error("Error purchasing ticket:", error);
      notification.error("Failed to purchase ticket: " + error.message);
    },
  });

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      notification.error("Please connect your wallet first");
      return;
    }

    if (!userDetails.aadhar || !userDetails.creditCard || !userDetails.cvv) {
      notification.error("Please fill in all fields");
      return;
    }

    try {
      const hash1 = sha256(userDetails.aadhar + userDetails.creditCard + userDetails.cvv);
      const hash2 = sha256(hash1 + eventId);

      await issueTicket({
        args: [`0x${hash1}`, `0x${hash2}`, BigInt(eventId)],
      });
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      notification.error("Failed to purchase ticket: " + (error as Error).message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-base-100 rounded-xl shadow-xl p-6 w-full max-w-md space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Purchase Ticket</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <label className="text-sm font-medium text-neutral opacity-85">Aadhar Number</label>
            <input
              type="text"
              value={userDetails.aadhar}
              onChange={e => setUserDetails({ ...userDetails, aadhar: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Enter Aadhar number"
            />
          </div>

          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label className="text-sm font-medium text-neutral opacity-85">Credit Card</label>
            <input
              type="text"
              value={userDetails.creditCard}
              onChange={e => setUserDetails({ ...userDetails, creditCard: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Enter credit card number"
            />
          </div>

          <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <label className="text-sm font-medium text-neutral opacity-85">CVV</label>
            <input
              type="password"
              value={userDetails.cvv}
              onChange={e => setUserDetails({ ...userDetails, cvv: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Enter CVV"
              maxLength={4}
            />
          </div>
        </div>

        <div className="pt-4 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <button
            onClick={handlePurchase}
            disabled={isIssuing || !isConnected || !userDetails.aadhar || !userDetails.creditCard || !userDetails.cvv}
            className="btn btn-primary w-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            {isIssuing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Purchasing...
              </>
            ) : (
              `Purchase for ${ticketPrice} POL`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseTicket;
