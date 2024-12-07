import React from 'react';

type EventBoxProps = {
  name: string;
  organizer: string;
  startTime: string;
  endTime: string;
  ticketPrice: string;
  maxAttendees: string;
};

const EventBox: React.FC<EventBoxProps> = ({ name, organizer, startTime, endTime, ticketPrice, maxAttendees }) => {
  return (
    <div className="rounded-lg shadow-lg p-4 bg-white hover:scale-105 hover:shadow-xl transition-all">
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className="text-sm">Organizer: {organizer}</p>
      <p className="text-sm">Start Time: {new Date(parseInt(startTime) * 1000).toLocaleString()}</p>
      <p className="text-sm">End Time: {new Date(parseInt(endTime) * 1000).toLocaleString()}</p>
      <p className="text-sm">Ticket Price: {parseFloat(ticketPrice)} ETH</p>
      <p className="text-sm">Max Attendees: {maxAttendees}</p>
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        View Details
      </button>
    </div>
  );
};

export default EventBox;
