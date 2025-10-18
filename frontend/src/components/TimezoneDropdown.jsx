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

const TimezoneDropdown = ({ selectedTimezone, onTimezoneChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="form-group">
      <label>Timezone</label>
      <div className="custom-dropdown" ref={dropdownRef}>
        <div
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedTimezone}</span>
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

        {isOpen && (
          <div className="dropdown-menu">
            {TIMEZONES.map((tz) => (
              <div
                key={tz}
                className={`dropdown-item ${
                  selectedTimezone === tz ? "selected" : ""
                }`}
                onClick={() => {
                  onTimezoneChange(tz);
                  setIsOpen(false);
                }}
              >
                {tz}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneDropdown;
