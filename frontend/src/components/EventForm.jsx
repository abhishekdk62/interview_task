import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewProfile, fetchAllProfiles } from '../redux/slices/profileSlice';
import { createNewEvent } from '../redux/slices/eventSlice';
import dayjs from 'dayjs';
import './EventForm.css';

const TIMEZONES = [
  'Eastern Time (ET)',
  'Pacific Time (PT)',
  'Central Time (CT)',
  'Mountain Time (MT)',
  'India (IST)',
  'London (GMT)',
  'Tokyo (JST)',
];

const EventForm = () => {
  const dispatch = useDispatch();
  const { profiles, loading: profileLoading } = useSelector((state) => state.profiles);
  const { loading: eventLoading } = useSelector((state) => state.events);

  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [timezone, setTimezone] = useState('Eastern Time (ET)');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [newProfileName, setNewProfileName] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);

  const profileDropdownRef = useRef(null);
  const timezoneDropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target)) {
        setIsTimezoneDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleAddProfileInForm = async () => {
    if (newProfileName.trim()) {
      const result = await dispatch(createNewProfile(newProfileName.trim()));
      if (result.type === 'profiles/create/fulfilled') {
        setNewProfileName('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProfiles.length === 0) {
      alert('Please select at least one profile');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
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

    const result = await dispatch(createNewEvent(eventData));
    if (result.type === 'events/create/fulfilled') {
      // Reset form
      setSelectedProfiles([]);
      setTimezone('Eastern Time (ET)');
      setStartDate('');
      setStartTime('09:00');
      setEndDate('');
      setEndTime('09:00');
      alert('Event created successfully!');
    }
  };

  return (
    <div className="event-form-container">
      <h2 className="form-title">Create Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Profiles Multi-Select */}
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

                <div className="add-profile-inline">
                  <input
                    type="text"
                    placeholder="Add new profile..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProfileInForm())}
                  />
                  <button
                    type="button"
                    className="add-btn-inline"
                    onClick={handleAddProfileInForm}
                    disabled={!newProfileName.trim() || profileLoading}
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
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Pick a date"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="create-event-btn" disabled={eventLoading}>
          {eventLoading ? (
            'Creating...'
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
