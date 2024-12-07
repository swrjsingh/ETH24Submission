'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import EventBox from './components/EventBox';

const query = gql`
  query {
    eventCreateds(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
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

const url = 'https://api.studio.thegraph.com/query/97295/events-polygon-amoy/version/latest';

const Data = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['events'],
    async queryFn() {
      const response = await request(url, query);
      console.log("Fetched data:", response); // Debug the data structure
      return response;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data || !data?.eventCreateds) {
    return <div>Error loading events or no events found.</div>;
  }

  return (
    <div className="grid gap-6">
      <h2 className="font-semibold text-2xl mb-4">Events</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {data?.eventCreateds.map((event: any) => (
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
