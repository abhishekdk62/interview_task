import React, { useState, useRef, useEffect } from "react";

const TIMEZONES = [
  "Eastern Time (ET)",
  "Pacific Time (PT)",
  "Central Time (CT)",
  "Mountain Time (MT)",
  "India (IST)",
  "London (GMT)",
  "Tokyo (JST)",
];

const EventListHeader = ({ viewTimezone, onTimezoneChange }) => {
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const timezoneDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
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

  return (
    <div className="event-list-header">
      <h2>Events</h2>

      <div className="view-timezone-section">
        <label>View in Timezone</label>
        <div className="custom-dropdown" ref={timezoneDropdownRef}>
          <div
            className="dropdown-trigger"
            onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
          >
            <span>{viewTimezone}</span>
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
                    viewTimezone === tz ? "selected" : ""
                  }`}
                  onClick={() => {
                    onTimezoneChange(tz);
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
    </div>
  );
};

export default EventListHeader;
