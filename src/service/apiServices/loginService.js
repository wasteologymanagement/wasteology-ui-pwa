// /api/endpoints/authApi.ts

import axiosInstance from "../axiosInstance";
import { AUTH_ENDPOINTS } from "./endpoints/apiEndpoints";

export const loginApi = async (data) => {
  const response = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, data);
  console.log("response.data:", response.data);
  return response.data;
};
