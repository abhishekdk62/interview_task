import React from "react";

const EventCard = ({ event, onEditClick, onLogsClick }) => {
  return (
    <div className="event-card">
      <div className="event-date-range">{event.formattedRange}</div>

      <div className="event-details">
        <div className="event-detail-row">
          <span className="detail-label">Profiles:</span>
          <span className="detail-value">{event.profileNames}</span>
        </div>

        <div className="event-detail-row">
          <span className="detail-label">Timezone:</span>
          <span className="detail-value">{event.timezone}</span>
        </div>

        <div className="event-timestamps">
          <div className="timestamp">
            <span>Created:</span> {event.formattedCreated}
          </div>
          {event.formattedUpdated && (
            <div className="timestamp">
              <span>Updated:</span> {event.formattedUpdated}
            </div>
          )}
        </div>
      </div>

      <div className="event-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEditClick(event)}
        >
          Edit
        </button>
        <button
          className="action-btn logs-btn"
          onClick={() => onLogsClick(event)}
        >
          View Logs
        </button>
      </div>
    </div>
  );
};

export default EventCard;
