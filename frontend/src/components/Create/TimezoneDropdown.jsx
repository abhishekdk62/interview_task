import React, { useState, useRef, useEffect } from "react";
import { TIMEZONES } from "../../constants/timezone";

const TimezoneDropdown = ({ selectedTimezone, onTimezoneChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedLabel = TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;

  const filteredTimezones = TIMEZONES.filter(tz =>
    tz.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTimezoneSelect = (value) => {
    onTimezoneChange(value);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="form-group">
      <label>Timezone</label>
      <div className="custom-dropdown" ref={dropdownRef}>
        <div
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
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

        {isOpen && (
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
                      selectedTimezone === tz.value ? "selected" : ""
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
  );
};

export default TimezoneDropdown;
