import React from "react";

const DateTimeInputs = ({
  startDate,
  startTime,
  endDate,
  endTime,
  today,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
}) => {
  return (
    <>
      <div className="form-group">
        <label>Start Date & Time</label>
        <div className="date-time-group">
          <input
            type="date"
            value={startDate}
            onChange={onStartDateChange}
            min={today}
            placeholder="Pick a date"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>End Date & Time</label>
        <div className="date-time-group">
          <input
            type="date"
            value={endDate}
            onChange={onEndDateChange}
            min={startDate || today}
            placeholder="Pick a date"
            disabled={!startDate}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            disabled={!startDate}
          />
        </div>
      </div>
    </>
  );
};

export default DateTimeInputs;
