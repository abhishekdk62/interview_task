import React from "react";
import EventCard from "./EventCard";

const EventsGrid = ({ events, onEditClick, onLogsClick }) => {
  if (events.length === 0) {
    return <div className="empty-state">No events found</div>;
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          onEditClick={onEditClick}
          onLogsClick={onLogsClick}
        />
      ))}
    </div>
  );
};

export default EventsGrid;
