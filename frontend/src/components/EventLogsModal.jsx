import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventLogs, clearLogs } from '../redux/slices/logSlice';
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const tz = TIMEZONE_MAP[timezone] || 'America/New_York';
    return dayjs(dateString).tz(tz).format('MMM DD, YYYY [at] hh:mm A');
  };

  return (
    <div className="modal-overlay" ref={modalRef}>
      <div className="modal-content logs-modal">
        <div className="modal-header">
          <h2>Event Update History</h2>
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
            <div className="loading-state">Loading logs...</div>
          ) : error ? (
            <div className="error-state">{error}</div>
          ) : logs.length === 0 ? (
            <div className="empty-state">No update history available</div>
          ) : (
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log._id} className="log-entry">
                  <div className="log-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 4V8L10.5 9.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="log-details">
                    <div className="log-timestamp">
                      {formatDateTime(log.timestamp || log.createdAt)}
                    </div>
                    <div className="log-change">{log.change || log.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventLogsModal;
