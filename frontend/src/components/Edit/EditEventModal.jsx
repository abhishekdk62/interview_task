import React, { useRef, useEffect, useState } from 'react';
import { useEditEventModal } from '../../hooks/useEditEventModal';
import { TIMEZONES } from '../../constants/timezone';
import './EditEventModal.css';

const EditEventModal = ({ event, onClose }) => {
  const {
    profiles,
    updateLoading,
    selectedProfiles,
    selectedTimezone,
    startDate,
    startTime,
    endDate,
    endTime,
    isProfileDropdownOpen,
    isTimezoneDropdownOpen,
    selectedTimezoneLabel,
    setIsProfileDropdownOpen,
    setIsTimezoneDropdownOpen,
    setSelectedTimezone,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    handleProfileToggle,
    handleSubmit,
  } = useEditEventModal(event, onClose);

  const profileDropdownRef = useRef(null);
  const timezoneDropdownRef = useRef(null);
  const timezoneSearchInputRef = useRef(null);
  const modalRef = useRef(null);

  const [timezoneSearchTerm, setTimezoneSearchTerm] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        onClose();
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target)) {
        setIsTimezoneDropdownOpen(false);
        setTimezoneSearchTerm('');
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose, setIsProfileDropdownOpen, setIsTimezoneDropdownOpen]);

  // Focus search input when timezone dropdown opens
  useEffect(() => {
    if (isTimezoneDropdownOpen && timezoneSearchInputRef.current) {
      timezoneSearchInputRef.current.focus();
    }
  }, [isTimezoneDropdownOpen]);

  // Filter timezones based on search term
  const filteredTimezones = TIMEZONES.filter(tz =>
    tz.label.toLowerCase().includes(timezoneSearchTerm.toLowerCase())
  );

  const handleTimezoneSelect = (value) => {
    setSelectedTimezone(value);
    setIsTimezoneDropdownOpen(false);
    setTimezoneSearchTerm('');
  };

  return (
    <div className="modal-overlay" ref={modalRef}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Event</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Profiles</label>
            <div className="custom-dropdown" ref={profileDropdownRef}>
              <div
                className="dropdown-trigger"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <span>
                  {selectedProfiles.length === 0
                    ? 'Select profiles...'
                    : `${selectedProfiles.length} profile${selectedProfiles.length > 1 ? 's' : ''} selected`}
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
                      <div style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '14px' }}>
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
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <div className="custom-dropdown" ref={timezoneDropdownRef}>
              <div
                className="dropdown-trigger"
                onClick={() => setIsTimezoneDropdownOpen(!isTimezoneDropdownOpen)}
              >
                <span>{selectedTimezoneLabel}</span>
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
                      ref={timezoneSearchInputRef}
                      type="text"
                      placeholder="Search timezone..."
                      value={timezoneSearchTerm}
                      onChange={(e) => setTimezoneSearchTerm(e.target.value)}
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
                          className={`dropdown-item ${selectedTimezone === tz.value ? 'selected' : ''}`}
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

          <div className="form-group">
            <label>Start Date & Time</label>
            <div className="date-time-group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Date & Time</label>
            <div className="date-time-group">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                required
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="update-btn" disabled={updateLoading}>
              {updateLoading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
