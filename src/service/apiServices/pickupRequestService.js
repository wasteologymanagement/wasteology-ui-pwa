import axiosInstance from '../axiosInstance';
import { TRASH_REQUEST_API } from './endpoints/apiConstants';
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

export const fetchAllTrashRequest = async () => {
  try {
      const response = await axiosInstance.get(TRASH_REQUEST_API.ALL_REQUESTS);
      console.log("response.data : ", response.data)
      return response.data;
  } catch (error) {
    console.error("API Call Failed:", error);
      throw error;
  }
}