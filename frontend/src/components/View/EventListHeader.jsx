import React, { useState, useRef, useEffect } from "react";
import { TIMEZONES } from "../../constants/timezone";

const EventListHeader = ({ viewTimezone, onTimezoneChange }) => {
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const timezoneDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        timezoneDropdownRef.current &&
        !timezoneDropdownRef.current.contains(event.target)
      ) {
        setIsTimezoneDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isTimezoneDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isTimezoneDropdownOpen]);

  const selectedLabel = TIMEZONES.find(tz => tz.value === viewTimezone)?.label || viewTimezone;

  // Filter timezones based on search term (case-insensitive)
  const filteredTimezones = TIMEZONES.filter(tz =>
    tz.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTimezoneSelect = (value) => {
    onTimezoneChange(value);
    setIsTimezoneDropdownOpen(false);
    setSearchTerm("");
  };

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
            <span>{selectedLabel}</span>
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
              <div className="dropdown-search">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search timezone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="timezone-search-input"
                />
              </div>

              <div className="dropdown-list">
                {filteredTimezones.length === 0 ? (
                  <div className="no-results">
                    No timezones found
                  </div>
                ) : (
                  filteredTimezones.map((tz) => (
                    <div
                      key={tz.value}
                      className={`dropdown-item ${
                        viewTimezone === tz.value ? "selected" : ""
                      }`}
                      onClick={() => handleTimezoneSelect(tz.value)}
                    >
                      {tz.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListHeader;
