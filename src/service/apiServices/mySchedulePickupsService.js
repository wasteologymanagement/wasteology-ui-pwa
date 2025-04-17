import axiosInstance from '../axiosInstance';
import { SCHEDULE_PICK_UP_ENDPOINTS } from './endpoints/apiEndpoints';

export const getScheduledPickupDetails = async (userId) => {
    try {
        // console.log("Fetching scheduled pickup details for userId:", userId);
      const response = await axiosInstance.get(`${SCHEDULE_PICK_UP_ENDPOINTS.GET_SCHEDULED_PICK_UPS}/${userId}`);
      // console.log("response.data for pickup : ", response.data)
      return response.data;
    } catch (error) {
      console.error("API Call Failed:", error);
      throw error;
    }
  };