import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast"; // Add this import
import {
  createNewProfile,
  fetchAllProfiles,
} from "../redux/slices/profileSlice";
import {
  clearError,
  createNewEvent,
  fetchEventsByProfile,
} from "../redux/slices/eventSlice";
import dayjs from "dayjs";
import "./EventForm.css";

const TIMEZONES = [
  "Eastern Time (ET)",
  "Pacific Time (PT)",
  "Central Time (CT)",
  "Mountain Time (MT)",
  "India (IST)",
  "London (GMT)",
  "Tokyo (JST)",
];

const EventForm = () => {
  const dispatch = useDispatch();
  const { profiles, createLoading: profileLoading } = useSelector(
    (state) => state.profiles
  );
  const { createLoading: eventLoading, error } = useSelector((state) => state.events);
  const today = dayjs().format("YYYY-MM-DD");
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState("Eastern Time (ET)");
  const [startDate, setStartDate] = useState(today);
  const tommorow = dayjs().add(1, "day").format("YYYY-MM-DD");
  const currentTime = dayjs().add(1, "minute").format("HH:mm");

  const [startTime, setStartTime] = useState(currentTime);
  const [endDate, setEndDate] = useState(tommorow);
  const [endTime, setEndTime] = useState("09:00");
  const [newProfileName, setNewProfileName] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const timezoneDropdownRef = useRef(null);
  const { selectedProfile, createLoading } = useSelector((state) => state.profiles);

  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        icon: "❌",
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        timezoneDropdownRef.current &&
        !timezoneDropdownRef.current.contains(event.target)
      ) {
        setIsTimezoneDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const getEvents = async () => {
  console.log('selectedid',selectedProfile._id);
  
    await dispatch(fetchEventsByProfile(selectedProfile._id));
  };
  const handleAddProfileInForm = async () => {
    if (newProfileName.trim()) {
      const result = await dispatch(createNewProfile(newProfileName.trim()));
      if (result.type === "profiles/create/fulfilled") {
        toast.success(`Profile "${newProfileName}" created!`);
        setNewProfileName("");
      }
    }
  };

  const handleStartDateChange = (e) => {
    const selectedDate = e.target.value;

    if (dayjs(selectedDate).isBefore(dayjs(), "day")) {
      toast.error("Start date cannot be in the past");
      return;
    }

    setStartDate(selectedDate);
    if (endDate && dayjs(endDate).isBefore(dayjs(selectedDate))) {
      setEndDate("");
      toast.info(
        "End date cleared. Please select an end date after start date."
      );
    }
  };
  const handleEndDateChange = (e) => {
    const selectedDate = e.target.value;

    if (!startDate) {
      toast.error("Please select start date first");
      return;
    }

    if (dayjs(selectedDate).isBefore(dayjs(startDate))) {
      toast.error("End date cannot be before start date");
      return;
    }

    setEndDate(selectedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProfiles.length === 0) {
      toast.error("Please select at least one profile", { icon: "⚠️" });
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates", { icon: "📅" });
      return;
    }

    if (dayjs(startDate).isBefore(dayjs(), "day")) {
      toast.error("Start date cannot be in the past");
      return;
    }

    const startDateTime = dayjs(`${startDate} ${startTime}`);
    const endDateTime = dayjs(`${endDate} ${endTime}`);
    if (endDateTime.isBefore(startDateTime)) {
      toast.error("End date/time must be after start date/time");
      return;
    }
    if (startDate === endDate && startTime >= endTime) {
      toast.error("End time must be after start time on the same day");
      return;
    }

    const eventData = {
      profiles: selectedProfiles,
      timezone,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    const result = await dispatch(createNewEvent(eventData));
    if (result.type === "events/create/fulfilled") {
        getEvents();
      setSelectedProfiles([]);
      setTimezone("Eastern Time (ET)");
      setStartDate(today);
      setStartTime(currentTime);
      setEndDate(tommorow);
      setEndTime("09:00");
      toast.success("Event created successfully!", { icon: "✅" });
    }
  };

  return (
    <div className="event-form-container">
      <h2 className="form-title">Create Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profiles</label>
          <div className="custom-dropdown" ref={profileDropdownRef}>
            <div
              className="dropdown-trigger"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <span>
                {selectedProfiles.length === 0
                  ? "Select profiles..."
                  : `${selectedProfiles.length} profile${
                      selectedProfiles.length > 1 ? "s" : ""
                    } selected`}
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {isProfileDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-list">
                  {profiles.length === 0 ? (
                    <div
                      style={{
                        padding: "12px 16px",
                        color: "#9ca3af",
                        fontSize: "14px",
                      }}
                    >
                      No profiles available
                    </div>
                  ) : (
                    profiles.map((profile) => (
                      <label key={profile._id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedProfiles.includes(profile._id)}
                          onChange={() => handleProfileToggle(profile._id)}
                        />
                        <span>{profile.name}</span>
                      </label>
                    ))
                  )}
                </div>

                <div className="add-profile-inline">
                  <input
                    type="text"
                    placeholder="Add new profile..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddProfileInForm())
                    }
                  />
                  <button
                    type="button"
                    className="add-btn-inline"
                    onClick={handleAddProfileInForm}
                    disabled={
                      !newProfileName.trim() ||
                      profileLoading ||
                      newProfileName.trim().length < 2
                    }
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3.33334V12.6667M3.33334 8H12.6667"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timezone */}
        <div className="form-group">
          <label>Timezone</label>
          <div className="custom-dropdown" ref={timezoneDropdownRef}>
            <div
              className="dropdown-trigger"
              onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
            >
              <span>{timezone}</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {isTimezoneDropdownOpen && (
              <div className="dropdown-menu">
                {TIMEZONES.map((tz) => (
                  <div
                    key={tz}
                    className={`dropdown-item ${
                      timezone === tz ? "selected" : ""
                    }`}
                    onClick={() => {
                      setTimezone(tz);
                      setIsTimezoneDropdownOpen(false);
                    }}
                  >
                    {tz}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Start Date & Time */}
        <div className="form-group">
          <label>Start Date & Time</label>
          <div className="date-time-group">
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={today} // ⭐ Prevents selecting past dates
              placeholder="Pick a date"
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>

        {/* End Date & Time */}
        <div className="form-group">
          <label>End Date & Time</label>
          <div className="date-time-group">
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || today} // ⭐ End date can't be before start date
              placeholder="Pick a date"
              disabled={!startDate} // ⭐ Disable until start date is selected
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={!startDate} // ⭐ Disable until start date is selected
            />
          </div>
        </div>

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
