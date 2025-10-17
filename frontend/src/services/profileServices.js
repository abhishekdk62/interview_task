import apiClient from "./apiClient";

export const getAllProfiles = () => apiClient.get("/api/profiles");

export const createProfile = (name) =>
  apiClient.post("/api/profiles", { name });

export const updateProfileTimezone = (profileId, timezone) =>
  apiClient.patch(`/api/profiles/${profileId}/timezone`, { timezone });
