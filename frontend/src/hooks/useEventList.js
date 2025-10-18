import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONE_MAP = {
  "Eastern Time (ET)": "America/New_York",
  "Pacific Time (PT)": "America/Los_Angeles",
  "Central Time (CT)": "America/Chicago",
  "Mountain Time (MT)": "America/Denver",
  "India (IST)": "Asia/Kolkata",
  "London (GMT)": "Europe/London",
  "Tokyo (JST)": "Asia/Tokyo",
};

export const useEventList = () => {
  const { events, loading } = useSelector((state) => state.events);
  const { selectedProfile, profiles } = useSelector((state) => state.profiles);

  const [viewTimezone, setViewTimezone] = useState("Eastern Time (ET)");
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

  // DSA #1: Hash Map for O(1) profile lookups
  const profileMap = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile._id] = profile;
      return acc;
    }, {});
  }, [profiles]);

  // DSA #2: Memoized sorted events by start date (O(n log n))
  const sortedEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    return [...events].sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }, [events]);

  // DSA #3: Memoized timezone conversion for date formatting
  const formatDateTime = useCallback(
    (dateString) => {
      if (!dateString) return "";
      const tz = TIMEZONE_MAP[viewTimezone] || "America/New_York";
      return dayjs(dateString).tz(tz).format("MMM DD, YYYY [at] hh:mm A");
    },
    [viewTimezone]
  );

  // DSA #4: Memoized date range formatter
  const formatDateRange = useCallback(
    (startDate, endDate) => {
      if (!startDate || !endDate) return "";
      const tz = TIMEZONE_MAP[viewTimezone] || "America/New_York";
      const start = dayjs(startDate).tz(tz);
      const end = dayjs(endDate).tz(tz);

      if (start.format("MMM DD, YYYY") === end.format("MMM DD, YYYY")) {
        return `${start.format("MMM DD, YYYY")} • ${start.format(
          "hh:mm A"
        )} - ${end.format("hh:mm A")}`;
      }
      return `${start.format("MMM DD, YYYY hh:mm A")} - ${end.format(
        "MMM DD, YYYY hh:mm A"
      )}`;
    },
    [viewTimezone]
  );

  // DSA #5: Memoized events with converted data
  const displayEvents = useMemo(() => {
    return sortedEvents.map((event) => ({
      ...event,
      formattedRange: formatDateRange(event.startDate, event.endDate),
      formattedCreated: formatDateTime(event.createdAt),
      formattedUpdated:
        event.updatedAt && event.updatedAt !== event.createdAt
          ? formatDateTime(event.updatedAt)
          : null,
      profileNames: event.profiles
        ?.map((p) =>
          typeof p === "string" ? profileMap[p]?.name || p : p.name
        )
        .join(", "),
    }));
  }, [sortedEvents, formatDateRange, formatDateTime, profileMap]);

  useEffect(() => {
    if (selectedProfile?.timezone) {
      setViewTimezone(selectedProfile.timezone);
    }
  }, [selectedProfile]);

  // DSA #6: useCallback for event handlers
  const handleEditClick = useCallback((event) => {
    setEditingEvent(event);
  }, []);

  const handleLogsClick = useCallback((event) => {
    setViewingLogsEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingEvent(null);
  }, []);

  const handleCloseLogsModal = useCallback(() => {
    setViewingLogsEvent(null);
  }, []);

  return {
    loading,
    selectedProfile,
    viewTimezone,
    editingEvent,
    viewingLogsEvent,
    displayEvents,
    setViewTimezone,
    handleEditClick,
    handleLogsClick,
    handleCloseModal,
    handleCloseLogsModal,
  };
};
