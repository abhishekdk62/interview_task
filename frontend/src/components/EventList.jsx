import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import EditEventModal from './EditEventModal';
import EventLogsModal from './EventLogsModal';
import './EventList.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONES = [
  'Eastern Time (ET)',
  'Pacific Time (PT)',
  'Central Time (CT)',
  'Mountain Time (MT)',
  'India (IST)',
  'London (GMT)',
  'Tokyo (JST)',
];

const TIMEZONE_MAP = {
  'Eastern Time (ET)': 'America/New_York',
  'Pacific Time (PT)': 'America/Los_Angeles',
  'Central Time (CT)': 'America/Chicago',
  'Mountain Time (MT)': 'America/Denver',
  'India (IST)': 'Asia/Kolkata',
  'London (GMT)': 'Europe/London',
  'Tokyo (JST)': 'Asia/Tokyo',
};

const EventList = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);
  const { selectedProfile } = useSelector((state) => state.profiles);

  const [viewTimezone, setViewTimezone] = useState('Eastern Time (ET)');
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

  const timezoneDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target)) {
        setIsTimezoneDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedProfile?.timezone) {
      setViewTimezone(selectedProfile.timezone);
    }
  }, [selectedProfile]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const tz = TIMEZONE_MAP[viewTimezone] || 'America/New_York';
    return dayjs(dateString).tz(tz).format('MMM DD, YYYY [at] hh:mm A');
  };

  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const tz = TIMEZONE_MAP[viewTimezone] || 'America/New_York';
    const start = dayjs(startDate).tz(tz);
    const end = dayjs(endDate).tz(tz);

    if (start.format('MMM DD, YYYY') === end.format('MMM DD, YYYY')) {
      return `${start.format('MMM DD, YYYY')} • ${start.format('hh:mm A')} - ${end.format('hh:mm A')}`;
    }
    return `${start.format('MMM DD, YYYY hh:mm A')} - ${end.format('MMM DD, YYYY hh:mm A')}`;
  };

  return (
    <div className="event-list-container">
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
                    className={`dropdown-item ${viewTimezone === tz ? 'selected' : ''}`}
                    onClick={() => {
                      setViewTimezone(tz);
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

      <div className="events-content">
        {!selectedProfile ? (
          <div className="empty-state">Please select a profile to view events</div>
        ) : loading ? (
          <div className="loading-state">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="empty-state">No events found</div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-date-range">
                  {formatDateRange(event.startDate, event.endDate)}
                </div>

                <div className="event-details">
                  <div className="event-detail-row">
                    <span className="detail-label">Profiles:</span>
                    <span className="detail-value">
                      {event.profiles?.map(p => p.name || p).join(', ')}
                    </span>
                  </div>

                  <div className="event-detail-row">
                    <span className="detail-label">Timezone:</span>
                    <span className="detail-value">{event.timezone}</span>
                  </div>

                  <div className="event-timestamps">
                    <div className="timestamp">
                      <span>Created:</span> {formatDateTime(event.createdAt)}
                    </div>
                    {event.updatedAt && event.updatedAt !== event.createdAt && (
                      <div className="timestamp">
                        <span>Updated:</span> {formatDateTime(event.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="event-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => setEditingEvent(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn logs-btn"
                    onClick={() => setViewingLogsEvent(event)}
                  >
                    View Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}

      {viewingLogsEvent && (
        <EventLogsModal
          event={viewingLogsEvent}
          timezone={viewTimezone}
          onClose={() => setViewingLogsEvent(null)}
        />
      )}
    </div>
  );
};

export default EventList;
