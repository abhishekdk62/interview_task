export const ENDPOINTS = {
  CREATE_EVENT: "/events",
  GET_EVENT_BY_PROFILE_ID: (profileId) => `/events/profile/${profileId}`,
  UPDATE_EVENT: (eventId) => `/events/${eventId}`,
  GET_LOGS_EVENT_ID:(eventId)=>`/logs/event/${eventId}`
};





