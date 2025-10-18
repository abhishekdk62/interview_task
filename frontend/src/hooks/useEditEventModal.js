import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import toast from 'react-hot-toast';
import { TIMEZONES } from '../constants/timezone';
import { fetchEventsByProfile, updateExistingEvent } from '../redux/slices/eventSlice';

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to get valid IANA timezone
const getValidTimezone = (tz) => {
  if (!tz) return 'America/New_York';
  
  // Check if it's already a valid timezone value
  if (TIMEZONES.some(timezone => timezone.value === tz)) {
    return tz;
  }
  
  // Check if it's a label, find the corresponding value
  const matchedTimezone = TIMEZONES.find(timezone => timezone.label === tz);
  return matchedTimezone ? matchedTimezone.value : 'America/New_York';
};

export const useEditEventModal = (event, onClose) => {
  const dispatch = useDispatch();
  const { profiles } = useSelector((state) => state.profiles);
  const { updateLoading } = useSelector((state) => state.events);
  const { selectedProfile } = useSelector((state) => state.profiles);

  // Get valid timezone first
  const validTimezone = getValidTimezone(event.timezone);

  const [selectedProfiles, setSelectedProfiles] = useState(
    event.profiles?.map(p => p._id || p) || []
  );
  
  const [selectedTimezone, setSelectedTimezone] = useState(validTimezone);
  
  // Now use the validated timezone for all date/time operations
  const [startDate, setStartDate] = useState(
    dayjs.utc(event.startDate).tz(validTimezone).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(
    dayjs.utc(event.startDate).tz(validTimezone).format('HH:mm')
  );
  const [endDate, setEndDate] = useState(
    dayjs.utc(event.endDate).tz(validTimezone).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(
    dayjs.utc(event.endDate).tz(validTimezone).format('HH:mm')
  );

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);

  const handleProfileToggle = useCallback((profileId) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProfiles.length === 0) {
      toast.error('Please select at least one profile');
      return;
    }
    
    const startDateTime = dayjs.tz(`${startDate} ${startTime}`, selectedTimezone);
    const endDateTime = dayjs.tz(`${endDate} ${endTime}`, selectedTimezone);
    const nowInSelectedTimezone = dayjs().tz(selectedTimezone);

    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      toast.error('Invalid date/time format');
      return;
    }

    if (startDateTime.isBefore(nowInSelectedTimezone)) {
      toast.error('Start date/time cannot be in the past');
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
      await dispatch(fetchEventsByProfile(selectedProfile._id));
      toast.success('Event updated successfully!');
      onClose();
    }
  };
  
  const selectedTimezoneLabel = TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;

  return {
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
  };
};
