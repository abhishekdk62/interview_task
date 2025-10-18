import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventLogs, clearLogs } from '../../redux/slices/logSlice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import './EventLogsModal.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE_MAP = {
  'Eastern Time (ET)': 'America/New_York',
  'Pacific Time (PT)': 'America/Los_Angeles',
  'Central Time (CT)': 'America/Chicago',
  'Mountain Time (MT)': 'America/Denver',
  'India (IST)': 'Asia/Kolkata',
  'London (GMT)': 'Europe/London',
  'Tokyo (JST)': 'Asia/Tokyo',
};

const LOG_ICONS = {
  timezone: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  profiles: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 14V12.5C13 10.567 11.433 9 9.5 9H6.5C4.567 9 3 10.567 3 12.5V14" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  startDate: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 2V4M4 2V4M2 6H14M3 4H13C13.55 4 14 4.45 14 5V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V5C2 4.45 2.45 4 3 4Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  endDate: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 2V4M4 2V4M2 6H14M3 4H13C13.55 4 14 4.45 14 5V13C14 13.55 13.55 14 13 14H3C2.45 14 2 13.55 2 13V5C2 4.45 2.45 4 3 4Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  default: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const EventLogsModal = ({ event, timezone, onClose }) => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.logs);
  const modalRef = useRef(null);

  useEffect(() => {
    if (event?._id) {
      dispatch(fetchEventLogs(event._id));
    }

    return () => {
      dispatch(clearLogs());
    };
  }, [event, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        onClose();
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

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const tz = TIMEZONE_MAP[timezone] || 'America/New_York';
    return dayjs(dateString).tz(tz).format('MMM DD, YYYY [at] hh:mm A');
  };

  const getLogIcon = (log) => {
    if (log.metadata?.field) {
      return LOG_ICONS[log.metadata.field] || LOG_ICONS.default;
    }
    return LOG_ICONS.default;
  };

  const getLogTypeLabel = (log) => {
    if (log.metadata?.field) {
      const labels = {
        timezone: 'Timezone',
        profiles: 'Profiles',
        startDate: 'Start Time',
        endDate: 'End Time',
      };
      return labels[log.metadata.field] || 'Update';
    }
    return 'Update';
  };

  const LogEntry = ({ log }) => (
    <div className="log-entry">
      <div className="log-icon">{getLogIcon(log)}</div>
      
      <div className="log-details">
        <div className="log-header">
          <span className="log-type">{getLogTypeLabel(log)}</span>
          <span className="log-timestamp">
            {formatDateTime(log.timestamp || log.createdAt)}
          </span>
        </div>
        
        <div className="log-message">{log.message}</div>
        
        {/* Show before/after values if available */}
        {log.metadata?.oldValue && log.metadata?.newValue && (
          <div className="log-changes">
            <div className="change-row">
              <span className="change-label">From:</span>
              <span className="old-value">{log.metadata.oldValue}</span>
            </div>
            <div className="change-row">
              <span className="change-label">To:</span>
              <span className="new-value">{log.metadata.newValue}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" ref={modalRef}>
      <div className="modal-content logs-modal">
        <div className="modal-header">
          <div>
            <h2>Event Update History</h2>
            <p className="event-title">
              {event?.formattedRange || 'Event details'}
            </p>
          </div>
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

        <div className="logs-content">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <span>Loading update history...</span>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{error}</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
                <path d="M24 16V24L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3>No Updates Yet</h3>
            </div>
          ) : (
            <div className="logs-list">
              {logs
                .sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
                .map((log) => (
                  <LogEntry key={log._id} log={log} />
                ))}
            </div>
          )}
        </div>

        {/* Footer with summary */}
        {logs.length > 0 && (
          <div className="logs-footer">
            <div className="logs-summary">
              Total changes: <strong>{logs.length}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLogsModal;
