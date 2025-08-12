// /api/endpoints/authApi.ts

import axiosInstance from "../axiosInstance";
import { AUTH_ENDPOINTS } from "./endpoints/apiEndpoints";

export const authenticateUser = async (obj) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, obj);
  const { access_token, refresh_token } = response.data;

  // Return the properties with names matching the Redux slice
  return {
    accessToken: access_token,
    refreshToken: refresh_token,
  };
};
