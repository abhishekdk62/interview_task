import { ENDPOINTS } from "../constants/event.endpoints";
import apiClient from "./apiClient";

export const createEvent = (eventData) =>
  apiClient.post(ENDPOINTS.CREATE_EVENT, eventData);

export const getEventsByProfile = (profileId) =>
  apiClient.get(ENDPOINTS.GET_EVENT_BY_PROFILE_ID(profileId));

export const updateEvent = (eventId, eventData) =>
  apiClient.put(ENDPOINTS.UPDATE_EVENT(eventId), eventData);

export const getEventLogs = (eventId) =>
  apiClient.get(ENDPOINTS.GET_LOGS_EVENT_ID(eventId));
