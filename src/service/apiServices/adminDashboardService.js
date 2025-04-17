import axiosInstance from '../axiosInstance';
import { OTHER_SERVICE_ENDPOINTS } from './endpoints/apiEndpoints';

// Fetch categories from the server
export const adminDashboard = async () => {
  const response = await axiosInstance.get(OTHER_SERVICE_ENDPOINTS.ADMIN_DASHBOARD);
  console.log("response : ", response)
  return response.data;
};