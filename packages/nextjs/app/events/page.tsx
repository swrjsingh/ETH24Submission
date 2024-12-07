"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";
import { sha256 } from "js-sha256";
import { useAccount } from "wagmi";

interface Event {
  id: string;
  eventId: string;
  organizer: string;
  name: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  maxAttendees: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

interface EventsResponse {
  eventCreateds: Event[];
}

interface UserDetails {
  aadhar: string;
  creditCard: string;
  cvv: string;
}

const query = gql`
  query {
    eventCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc, where: { organizer_not: null }) {
      id
      eventId
      organizer
      name
      startTime
      endTime
      ticketPrice
      maxAttendees
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

const url = "https://api.studio.thegraph.com/query/97295/create-event-polygon-amoy/v0.0.1";

const EventPage = () => {
  const { address, isConnected } = useAccount();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    aadhar: "",
    creditCard: "",
    cvv: "",
  });

  const { data, isLoading, isError } = useQuery<EventsResponse>({
    queryKey: ["events"],
    async queryFn() {
      try {
        const response = await request<EventsResponse>(url, query);
        return response;
      } catch (error) {
        console.error("GraphQL query error:", error);
        throw error;
      }
    },
  });

  const handleBuyTicket = async (event: Event) => {
    if (!userDetails.aadhar || !userDetails.creditCard || !userDetails.cvv) {
      alert("Please fill in all user details");
      return;
    }

    // Generate hashes
    const hash1 = sha256(userDetails.aadhar + userDetails.creditCard + userDetails.cvv);
    const hash2 = sha256(hash1 + event.eventId);

    // TODO: Implement NFT minting logic here
    console.log("Hash1:", hash1);
    console.log("Hash2:", hash2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (isError || !data || !data?.eventCreateds) {
    return (
      <div className="text-center p-4 text-error">
        <p>Error loading events or no events found.</p>
        <p className="text-sm mt-2">Please make sure you&apos;re connected to Polygon Amoy network.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-8 animate-fade-in">Available Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.eventCreateds.map(event => (
          <div
            key={event.id}
            className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-200 animate-slide-up"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">{event.name}</h2>
              <div className="space-y-2 text-sm opacity-85">
                <p>
                  <span className="font-semibold">Start:</span>{" "}
                  {new Date(parseInt(event.startTime) * 1000).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">End:</span>{" "}
                  {new Date(parseInt(event.endTime) * 1000).toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> {event.ticketPrice} MATIC
                </p>
                <p>
                  <span className="font-semibold">Available Seats:</span> {event.maxAttendees}
                </p>
              </div>

              {selectedEvent?.id === event.id && (
                <div className="mt-4 space-y-4 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Aadhar Number"
                    className="input input-bordered w-full"
                    value={userDetails.aadhar}
                    onChange={e => setUserDetails({ ...userDetails, aadhar: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Credit Card Number"
                    className="input input-bordered w-full"
                    value={userDetails.creditCard}
                    onChange={e => setUserDetails({ ...userDetails, creditCard: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="input input-bordered w-full"
                    value={userDetails.cvv}
                    onChange={e => setUserDetails({ ...userDetails, cvv: e.target.value })}
                  />
                </div>
              )}

              <div className="card-actions justify-end mt-4">
                {selectedEvent?.id === event.id ? (
                  <button
                    className="btn btn-primary shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => handleBuyTicket(event)}
                    disabled={!isConnected}
                  >
                    Buy Ticket
                  </button>
                ) : (
                  <button
                    className="btn btn-outline btn-primary shadow-sm hover:shadow-md transition-all duration-200"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Join Event
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventPage;
