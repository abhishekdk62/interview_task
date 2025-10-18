import React from "react";
import { useEventForm } from "../hooks/useEventForm";
import ProfileDropdown from "./ProfileDropdown";
import TimezoneDropdown from "./TimezoneDropdown";
import DateTimeInputs from "./DateTimeInputs";
import "./EventForm.css";

const EventForm = () => {
  const {
    profiles,
    profileLoading,
    eventLoading,
    selectedProfiles,
    selectedTimezone,
    startDate,
    startTime,
    endDate,
    endTime,
    today,
    setSelectedTimezone,
    setStartTime,
    setEndTime,
    handleProfileToggle,
    handleStartDateChange,
    handleEndDateChange,
    validateAndSubmit,
  } = useEventForm();

  return (
    <div className="event-form-container">
      <h2 className="form-title">Create Event</h2>
      <form onSubmit={validateAndSubmit}>
        <ProfileDropdown
          profiles={profiles}
          selectedProfiles={selectedProfiles}
          onProfileToggle={handleProfileToggle}
          profileLoading={profileLoading}
        />

        <TimezoneDropdown
          selectedTimezone={selectedTimezone}
          onTimezoneChange={setSelectedTimezone}
        />

        <DateTimeInputs
          startDate={startDate}
          startTime={startTime}
          endDate={endDate}
          endTime={endTime}
          today={today}
          onStartDateChange={handleStartDateChange}
          onStartTimeChange={setStartTime}
          onEndDateChange={handleEndDateChange}
          onEndTimeChange={setEndTime}
        />

        <button
          type="submit"
          className="create-event-btn"
          disabled={eventLoading}
        >
          {eventLoading ? (
            "Creating..."
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3.33334V12.6667M3.33334 8H12.6667"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Create Event
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
