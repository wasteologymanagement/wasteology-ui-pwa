// /api/endpoints/authApi.ts

import axiosInstance from "../axiosInstance";
import { AUTH_ENDPOINTS } from "./endpoints/apiEndpoints";

export const authenticateUser = async (pass) => {
  let password = "admin"
  const response = await axiosInstance.post(AUTH_ENDPOINTS.GENERATE_TOKEN, {"password" : password});
  const { access_token, refresh_token } = response.data;

  // Return the properties with names matching the Redux slice
  return {
    accessToken: access_token,
    refreshToken: refresh_token,
  };
};
