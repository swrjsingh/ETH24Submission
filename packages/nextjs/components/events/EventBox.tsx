"use client";

import React, { useState } from "react";
import PurchaseTicket from "./PurchaseTicket";
import { motion } from "framer-motion";
import { FaCalendar, FaClock, FaEthereum, FaUsers } from "react-icons/fa";
import { formatEther } from "viem";

interface EventBoxProps {
  id: string;
  name: string;
  organizer: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  maxAttendees: string;
}

export const EventBox = ({ id, name, organizer, startTime, endTime, ticketPrice, maxAttendees }: EventBoxProps) => {
  const [showPurchase, setShowPurchase] = useState(false);

  const now = Math.floor(Date.now() / 1000);
  const status = parseInt(endTime) < now ? "completed" : parseInt(startTime) > now ? "upcoming" : "active";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 space-y-4"
      >
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{name}</h3>
          <div
            className={`badge ${
              status === "completed" ? "badge-neutral" : status === "upcoming" ? "badge-primary" : "badge-accent"
            }`}
          >
            {status}
          </div>
        </div>

        <div className="space-y-2 text-sm opacity-85">
          <div className="flex items-center gap-2">
            <FaCalendar className="text-primary" />
            <span>{new Date(parseInt(startTime) * 1000).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-primary" />
            <span>
              {new Date(parseInt(startTime) * 1000).toLocaleTimeString()} -{" "}
              {new Date(parseInt(endTime) * 1000).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-primary" />
            <span>{maxAttendees} max attendees</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEthereum className="text-primary" />
            <span>{formatEther(BigInt(ticketPrice))} POL</span>
          </div>
        </div>

        {status !== "completed" && (
          <button
            onClick={() => setShowPurchase(true)}
            className="btn btn-primary w-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          >
            Buy Ticket
          </button>
        )}
      </motion.div>

      {showPurchase && (
        <PurchaseTicket
          eventId={id}
          ticketPrice={formatEther(BigInt(ticketPrice))}
          onClose={() => setShowPurchase(false)}
        />
      )}
    </>
  );
};

export default EventBox;
