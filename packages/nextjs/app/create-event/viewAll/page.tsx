"use client";

import React from "react";
import EventBox from "./components/EventBox";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from "graphql-request";

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

// The Graph endpoint for the CreateEvent contract on Polygon Amoy
const url = "https://api.studio.thegraph.com/query/97295/create-event-polygon-amoy/v0.0.1";

const Data = () => {
  const { data, isLoading, isError } = useQuery<EventsResponse>({
    queryKey: ["events"],
    async queryFn() {
      try {
        const response = await request<EventsResponse>(url, query);
        console.log("Fetched data:", response);
        return response;
      } catch (error) {
        console.error("GraphQL query error:", error);
        throw error;
      }
    },
  });

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
    <div className="grid gap-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-2xl">Events</h2>
        <span className="text-sm text-neutral-500">{data.eventCreateds.length} events found</span>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {data.eventCreateds.map(event => (
          <EventBox
            key={event.id}
            name={event.name}
            organizer={event.organizer}
            startTime={event.startTime}
            endTime={event.endTime}
            ticketPrice={event.ticketPrice}
            maxAttendees={event.maxAttendees}
          />
        ))}
      </div>
    </div>
  );
};

export default Data;
