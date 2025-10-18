import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { TIMEZONES } from "../constants/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useEventList = () => {
  const { events, loading } = useSelector((state) => state.events);
  const { selectedProfile, profiles } = useSelector((state) => state.profiles);

  const [viewTimezone, setViewTimezone] = useState("America/New_York");
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogsEvent, setViewingLogsEvent] = useState(null);

  const profileMap = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile._id] = profile;
      return acc;
    }, {});
  }, [profiles]);

  const sortedEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    return [...events].sort((a, b) => {
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }, [events]);

  const formatDateTime = useCallback(
    (dateString) => {
      if (!dateString) return "";
      return dayjs.utc(dateString).tz(viewTimezone).format("MMM DD, YYYY [at] h:mm A");
    },
    [viewTimezone]
  );

  const formatDateRange = useCallback(
    (startDate, endDate) => {
      if (!startDate || !endDate) return "";
      const start = dayjs.utc(startDate).tz(viewTimezone);
      const end = dayjs.utc(endDate).tz(viewTimezone);

      if (start.format("MMM DD, YYYY") === end.format("MMM DD, YYYY")) {
        return `${start.format("MMM DD, YYYY")} • ${start.format(
          "h:mm A"
        )} - ${end.format("h:mm A")}`;
      }
      return `${start.format("MMM DD, YYYY h:mm A")} - ${end.format(
        "MMM DD, YYYY h:mm A"
      )}`;
    },
    [viewTimezone]
  );

  const displayEvents = useMemo(() => {
    const timezoneLabel = TIMEZONES.find(tz => tz.value === viewTimezone)?.label || viewTimezone;
    
    return sortedEvents.map((event) => {
      const eventTimezoneLabel = TIMEZONES.find(tz => tz.value === event.timezone)?.label || event.timezone;
      
      return {
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
        timezone: eventTimezoneLabel,
      };
    });
  }, [sortedEvents, formatDateRange, formatDateTime, profileMap, viewTimezone]);

  useEffect(() => {
    if (selectedProfile?.timezone) {
      setViewTimezone(selectedProfile.timezone);
    }
  }, [selectedProfile]);

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
