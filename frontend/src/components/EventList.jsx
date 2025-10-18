import React from "react";
import { useEventList } from "../hooks/useEventList";
import EventListHeader from "./EventListHeader";
import LoadingSkeleton from "./LoadingSkeleton";
import EventsGrid from "./EventsGrid";
import EditEventModal from "./EditEventModal";
import EventLogsModal from "./EventLogsModal";
import "./EventList.css";

const EventList = () => {
  const {
    loading,
    selectedProfile,
    viewTimezone,
    editingEvent,
    viewingLogsEvent,
    displayEvents,
    setViewTimezone,
    handleEditClick,
    handleLogsClick,
    handleCloseModal,
    handleCloseLogsModal,
  } = useEventList();

  const renderContent = () => {
    if (!selectedProfile) {
      return (
        <div className="empty-state">
          Please select a profile to view events
        </div>
      );
    }

    if (loading) {
      return <LoadingSkeleton />;
    }

    return (
      <EventsGrid
        events={displayEvents}
        onEditClick={handleEditClick}
        onLogsClick={handleLogsClick}
      />
    );
  };

  return (
    <div className="event-list-container">
      <EventListHeader
        viewTimezone={viewTimezone}
        onTimezoneChange={setViewTimezone}
      />

      <div className="events-content">{renderContent()}</div>

      {editingEvent && (
        <EditEventModal event={editingEvent} onClose={handleCloseModal} />
      )}

      {viewingLogsEvent && (
        <EventLogsModal
          event={viewingLogsEvent}
          timezone={viewTimezone}
          onClose={handleCloseLogsModal}
        />
      )}
    </div>
  );
};

export default EventList;
