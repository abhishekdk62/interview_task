import { ENDPOINTS } from "../constants/profile.endpoints";
import apiClient from "./apiClient";

export const getAllProfiles = () => apiClient.get(ENDPOINTS.GET_ALL_PROFILES);

export const createProfile = (name) =>
  apiClient.post(ENDPOINTS.CREATE_PROFILE, { name });

export const updateProfileTimezone = (profileId, timezone) =>
  apiClient.patch(ENDPOINTS.UPDATE_PROFILE_TIMEZONE(profileId), { timezone });
