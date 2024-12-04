"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div className="text-center space-y-12 px-4 animate-fade-in">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-primary drop-shadow-md animate-slide-up">ZKonnect</h1>
          <p
            className="text-xl text-neutral opacity-85 max-w-lg mx-auto animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Secure Event Management with Zero-Knowledge Proofs
          </p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <Link
            href="/create-event"
            className="btn btn-primary btn-lg min-w-[200px] text-lg font-semibold shadow-md hover:shadow-strong hover:scale-[1.02] transition-all duration-200"
          >
            Create Event
          </Link>
          <Link
            href="/join-event"
            className="btn btn-secondary btn-lg min-w-[200px] text-lg font-semibold shadow-md hover:shadow-strong hover:scale-[1.02] transition-all duration-200"
          >
            Join Event
          </Link>
        </div>

        {connectedAddress && (
          <div
            className="mt-8 text-sm text-neutral opacity-75 hover:opacity-95 transition-all duration-200 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            Connected as: <Address address={connectedAddress} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
