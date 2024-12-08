"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { gql, request } from "graphql-request";
import { sha256 } from "js-sha256";
import { FaCalendar, FaClock, FaTicketAlt } from "react-icons/fa";
import { useAccount } from "wagmi";

interface Ticket {
  id: string;
  tokenId: string;
  eventId: string;
  hash1: string;
  hash2: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface Event {
  id: string;
  eventId: string;
  name: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  maxAttendees: string;
}

interface TicketsResponse {
  ticketIssueds: Array<{
    id: string;
    eventId: string;
    hash1: string;
    tokenId: string;
  }>;
  eventCreateds: Array<{
    eventId: string;
    name: string;
    startTime: string;
    endTime: string;
  }>;
}

interface ProcessedTicket {
  id: string;
  eventId: string;
  hash1: string;
  tokenId: string;
  status: "upcoming" | "active" | "completed";
  event?: {
    eventId: string;
    name: string;
    startTime: string;
    endTime: string;
  };
}

const query = gql`
  query GetUserTickets($hash1: String!) {
    ticketIssueds(where: { hash1: $hash1 }) {
      id
      tokenId
      eventId
      hash1
      hash2
      blockNumber
      blockTimestamp
      transactionHash
    }
    eventCreateds {
      id
      eventId
      name
      startTime
      endTime
      ticketPrice
      maxAttendees
    }
  }
`;

// The Graph endpoint
const url = "https://api.studio.thegraph.com/query/97295/create-event-polygon-amoy/v0.0.1";

const MyTickets = () => {
  const { address } = useAccount();
  const [userDetails, setUserDetails] = useState({
    aadhar: "",
    creditCard: "",
    cvv: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Query tickets only after user enters their details
  const { data, isLoading, isError } = useQuery<TicketsResponse>({
    queryKey: ["userTickets", userDetails],
    queryFn: async () => {
      const hash1 = sha256(userDetails.aadhar + userDetails.creditCard + userDetails.cvv);
      return request<TicketsResponse>(url, query, { hash1 });
    },
    enabled: isAuthenticated && Boolean(userDetails.aadhar && userDetails.creditCard && userDetails.cvv),
  });

  const handleAuthenticate = () => {
    if (userDetails.aadhar && userDetails.creditCard && userDetails.cvv) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-10 p-6 bg-base-100 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center mb-8">View Your Tickets</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral opacity-85">Aadhar Number</label>
            <input
              type="text"
              value={userDetails.aadhar}
              onChange={e => setUserDetails({ ...userDetails, aadhar: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Enter Aadhar number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral opacity-85">Credit Card</label>
            <input
              type="text"
              value={userDetails.creditCard}
              onChange={e => setUserDetails({ ...userDetails, creditCard: e.target.value })}
              className="input input-bordered w-full bg-base-100 shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Enter credit card number"
            />
          </div>
          <div className="space-y-2">
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
          <button
            onClick={handleAuthenticate}
            className="btn btn-primary w-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            disabled={!userDetails.aadhar || !userDetails.creditCard || !userDetails.cvv}
          >
            View Tickets
          </button>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center p-4 text-error">
        <p>Error loading tickets.</p>
        <p className="text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const tickets: ProcessedTicket[] =
    data?.ticketIssueds.map(ticket => {
      const event = data.eventCreateds.find(e => e.eventId === ticket.eventId);
      const startTime = parseInt(event?.startTime || "0");
      const endTime = parseInt(event?.endTime || "0");

      let status: ProcessedTicket["status"];
      if (endTime < now) status = "completed";
      else if (startTime > now) status = "upcoming";
      else status = "active";

      return {
        ...ticket,
        event,
        status,
      };
    }) ?? [];

  const upcomingTickets = tickets.filter((t: ProcessedTicket) => t.status === "upcoming");
  const activeTickets = tickets.filter((t: ProcessedTicket) => t.status === "active");
  const completedTickets = tickets.filter((t: ProcessedTicket) => t.status === "completed");

  const TicketCard = ({ ticket }: { ticket: ProcessedTicket }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-base-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 space-y-4"
    >
      <h3 className="text-xl font-semibold">{ticket.event?.name || "Unknown Event"}</h3>
      <div className="space-y-2 text-sm opacity-85">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-primary" />
          <span>{new Date(parseInt(ticket.event?.startTime || "0") * 1000).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaClock className="text-primary" />
          <span>
            {new Date(parseInt(ticket.event?.startTime || "0") * 1000).toLocaleTimeString()} -{" "}
            {new Date(parseInt(ticket.event?.endTime || "0") * 1000).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaTicketAlt className="text-primary" />
          <span>Ticket #{ticket.tokenId}</span>
        </div>
      </div>
      {ticket.status === "active" && <button className="btn btn-primary w-full mt-4">Show QR Code</button>}
    </motion.div>
  );

  const TicketSection = ({ title, tickets }: { title: string; tickets: typeof upcomingTickets }) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {tickets.length === 0 ? (
        <p className="text-neutral-500">No tickets found</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold mb-8">My Tickets</h1>

      <TicketSection title="Active Events" tickets={activeTickets} />
      <TicketSection title="Upcoming Events" tickets={upcomingTickets} />
      <TicketSection title="Past Events" tickets={completedTickets} />
    </div>
  );
};

export default MyTickets;
