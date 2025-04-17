import axiosInstance from '../axiosInstance';
import { SCHEDULE_PICK_UP_ENDPOINTS } from './endpoints/apiEndpoints';

export const trashRequestApi = async (formData) => {
    try {
      console.log("Trash pickup request data:", formData);
      const response = await axiosInstance.post(SCHEDULE_PICK_UP_ENDPOINTS.SUBMIT_PICKUP_REQUEST, formData);
      console.log("response.data : ", response.data)
      return response.data;
    } catch (error) {
      console.error("API Call Failed:", error);
      throw error;
    }
  };