"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="text-center space-y-12 px-4">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-primary">ZKonnect</h1>
          <p className="text-xl text-base-content/80">Secure Event Management with Zero-Knowledge Proofs</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create-event" className="btn btn-primary btn-lg min-w-[200px] text-lg font-semibold">
            Create Event
          </Link>
          <Link href="/join-event" className="btn btn-secondary btn-lg min-w-[200px] text-lg font-semibold">
            Join Event
          </Link>
        </div>

        {connectedAddress && (
          <div className="mt-8 text-sm opacity-70">
            Connected as: <Address address={connectedAddress} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
