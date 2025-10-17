import apiClient from "./apiClient";

export const createEvent = (eventData) =>
  apiClient.post("/api/events", eventData);

export const getEventsByProfile = (profileId) =>
  apiClient.get(`/api/events/profile/${profileId}`);

export const updateEvent = (eventId, eventData) =>
  apiClient.put(`/api/events/${eventId}`, eventData);

export const getEventLogs = (eventId) =>
  apiClient.get(`/api/logs/event/${eventId}`);
