import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchAllProfiles } from "../redux/slices/profileSlice";
import { clearError, createNewEvent, fetchEventsByProfile } from "../redux/slices/eventSlice";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const useEventForm = () => {
  const dispatch = useDispatch();
  const { profiles, createLoading: profileLoading, selectedProfile } = useSelector(
    (state) => state.profiles
  );
  const { createLoading: eventLoading, error } = useSelector(
    (state) => state.events
  );

  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const tomorrow = useMemo(() => dayjs().add(1, "day").format("YYYY-MM-DD"), []);
  const currentTime = useMemo(() => dayjs().add(5, "minute").format("HH:mm"), []);

  const [selectedProfiles, setSelectedProfiles] = useState(new Set());
  const [selectedTimezone, setSelectedTimezone] = useState("America/New_York"); 
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState(currentTime);
  const [endDate, setEndDate] = useState(tomorrow);
  const [endTime, setEndTime] = useState("09:00");

  const profileMap = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile._id] = profile;
      return acc;
    }, {});
  }, [profiles]);

  useEffect(() => {
    dispatch(fetchAllProfiles(""));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { duration: 4000, icon: "❌" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const getEvents = useCallback(async () => {
    if (selectedProfile?._id) {
      await dispatch(fetchEventsByProfile(selectedProfile._id));
    }
  }, [dispatch, selectedProfile]);

  const handleProfileToggle = useCallback((profileId) => {
    setSelectedProfiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  }, []);

  const handleStartDateChange = useCallback((e) => {
    const selectedDate = e.target.value;
    setStartDate(selectedDate);
    
    if (endDate && dayjs(endDate).isBefore(dayjs(selectedDate))) {
      setEndDate("");
      toast.info("End date cleared. Please select an end date after start date.");
    }
  }, [endDate]);

  const handleEndDateChange = useCallback((e) => {
    const selectedDate = e.target.value;

    if (!startDate) {
      toast.error("Please select start date first");
      return;
    }

    if (dayjs(selectedDate).isBefore(dayjs(startDate))) {
      toast.error("End date cannot be before start date");
      return;
    }

    setEndDate(selectedDate);
  }, [startDate]);

  const validateAndSubmit = async (e) => {
    e.preventDefault();

    const selectedProfilesArray = Array.from(selectedProfiles);

    if (selectedProfilesArray.length === 0) {
      toast.error("Please select at least one profile", { icon: "⚠️" });
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates", { icon: "📅" });
      return;
    }

    const startDateTime = dayjs.tz(`${startDate} ${startTime}`, selectedTimezone);
    const endDateTime = dayjs.tz(`${endDate} ${endTime}`, selectedTimezone);
    const nowInSelectedTimezone = dayjs().tz(selectedTimezone);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      toast.error("Invalid date/time format");
      return;
    }

    if (startDateTime.isBefore(nowInSelectedTimezone)) {
      toast.error("Start date/time cannot be in the past");
      return;
    }

    if (endDateTime.isBefore(startDateTime) || endDateTime.isSame(startDateTime)) {
      toast.error("End date/time must be after start date/time");
      return;
    }

    const eventData = {
      profiles: selectedProfilesArray,
      timezone: selectedTimezone, 
      startDate: startDateTime.utc().toISOString(),
      endDate: endDateTime.utc().toISOString(), 
    };

    const result = await dispatch(createNewEvent(eventData));
    if (result.type === "events/create/fulfilled") {
      await getEvents();
      setSelectedProfiles(new Set());
      setSelectedTimezone("America/New_York"); 
      setStartDate(today);
      setStartTime(currentTime);
      setEndDate(tomorrow);
      setEndTime("09:00");
      toast.success("Event created successfully!", { icon: "✅" });
    }
  };

  return {
    profiles,
    profileLoading,
    eventLoading,
    selectedProfiles,
    selectedTimezone,
    startDate,
    startTime,
    endDate,
    endTime,
    today,
    profileMap,
    setSelectedProfiles,
    setSelectedTimezone,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    handleProfileToggle,
    handleStartDateChange,
    handleEndDateChange,
    validateAndSubmit,
  };
};
