import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventsByProfile, updateExistingEvent } from '../../redux/slices/eventSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { TIMEZONES } from '../../constants/timezone'; 
import './EditEventModal.css';
import toast from 'react-hot-toast';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditEventModal = ({ event, onClose }) => {
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profiles);
  const { updateLoading } = useSelector((state) => state.events);
  const { selectedProfile } = useSelector((state) => state.profiles);

  const [selectedProfiles, setSelectedProfiles] = useState(
    event.profiles?.map(p => p._id || p) || []
  );
  
  const [selectedTimezone, setSelectedTimezone] = useState(
    event.timezone || 'America/New_York'
  );
  
  const [startDate, setStartDate] = useState(
    dayjs.utc(event.startDate).tz(event.timezone).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    dayjs.utc(event.startDate).tz(event.timezone).format('HH:mm')
  );
  const [endDate, setEndDate] = useState(
    dayjs.utc(event.endDate).tz(event.timezone).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(
    dayjs.utc(event.endDate).tz(event.timezone).format('HH:mm')
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
      toast.error('Please select at least one profile');
      return;
    }
    
    const startDateTime = dayjs.tz(`${startDate} ${startTime}`, selectedTimezone);
    const endDateTime = dayjs.tz(`${endDate} ${endTime}`, selectedTimezone);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      toast.error('Invalid date/time format');
      return;
    }

    if (endDateTime.isBefore(startDateTime) || endDateTime.isSame(startDateTime)) {
      toast.error('End date/time must be after start date/time');
      return;
    }

    const eventData = {
      profiles: selectedProfiles,
      timezone: selectedTimezone, 
      startDate: startDateTime.utc().toISOString(), 
      endDate: endDateTime.utc().toISOString(),
    };

    const result = await dispatch(updateExistingEvent({
      eventId: event._id,
      eventData,
    }));

    if (result.type === 'events/update/fulfilled') {
      dispatch(fetchEventsByProfile(selectedProfile._id));
      toast.success('Event updated successfully!');
      onClose();
    }
  };

  const selectedTimezoneLabel = TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;

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

          {/* Timezone */}
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
                  {TIMEZONES.map((tz) => (
                    <div
                      key={tz.value}
                      className={`dropdown-item ${selectedTimezone === tz.value ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedTimezone(tz.value);
                        setIsTimezoneDropdownOpen(false);
                      }}
                    >
                      {tz.label}
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

          {/* End Date & Time */}
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
