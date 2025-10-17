import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateExistingEvent } from '../redux/slices/eventSlice';
import dayjs from 'dayjs';
import './EditEventModal.css';

const TIMEZONES = [
  'Eastern Time (ET)',
  'Pacific Time (PT)',
  'Central Time (CT)',
  'Mountain Time (MT)',
  'India (IST)',
  'London (GMT)',
  'Tokyo (JST)',
];

const EditEventModal = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profiles);
  const { loading } = useSelector((state) => state.events);

  const [selectedProfiles, setSelectedProfiles] = useState(
    event.profiles?.map(p => p._id || p) || []
  );
  const [timezone, setTimezone] = useState(event.timezone || 'Eastern Time (ET)');
  const [startDate, setStartDate] = useState(
    dayjs(event.startDate).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    dayjs(event.startDate).format('HH:mm')
  );
  const [endDate, setEndDate] = useState(
    dayjs(event.endDate).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(
    dayjs(event.endDate).format('HH:mm')
  );

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const timezoneDropdownRef = useRef(null);
  const modalRef = useRef(null);

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
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProfiles.length === 0) {
      alert('Please select at least one profile');
      return;
    }

    const startDateTime = dayjs(`${startDate} ${startTime}`);
    const endDateTime = dayjs(`${endDate} ${endTime}`);

    if (endDateTime.isBefore(startDateTime)) {
      alert('End date/time cannot be before start date/time');
      return;
    }

    const eventData = {
      profiles: selectedProfiles,
      timezone,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
    };

    const result = await dispatch(updateExistingEvent({
      eventId: event._id,
      eventData,
    }));

    if (result.type === 'events/update/fulfilled') {
      alert('Event updated successfully!');
      onClose();
    }
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
          {/* Profiles */}
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
                    {profiles.map((profile) => (
                      <label key={profile._id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={selectedProfiles.includes(profile._id)}
                          onChange={() => handleProfileToggle(profile._id)}
                        />
                        <span>{profile.name}</span>
                      </label>
                    ))}
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
                      className={`dropdown-item ${timezone === tz ? 'selected' : ''}`}
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
                onChange={(e) => setStartDate(e.target.value)}
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
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="update-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
