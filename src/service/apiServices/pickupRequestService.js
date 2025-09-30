import axiosInstance from '../axiosInstance';
import { TRASH_REQUEST_API, ADMIN_API } from './endpoints/apiConstants';
import { SCHEDULE_PICK_UP_ENDPOINTS } from './endpoints/apiEndpoints';

// export const trashRequestApi = async (formData) => {
//     try {
//       console.log("Trash pickup request data:", formData);
//       const response = await axiosInstance.post(SCHEDULE_PICK_UP_ENDPOINTS.SUBMIT_PICKUP_REQUEST, formData);
//       console.log("response.data : ", response.data)
//       return response.data;
//     } catch (error) {
//       console.error("API Call Failed:", error);
//       throw error;
//     }
//   };

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

export const trashRequestApi = async (formData) => {
  try {
    console.log("Trash pickup request data:", formData);
    const response = await axiosInstance.post(TRASH_REQUEST_API.REQUEST_SUBMIT, formData);
    console.log("response.data : ", response.data)
    return response.data;
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};


export const getScheduledPickupDetails = async (userId) => {
  try {
    // console.log("Fetching scheduled pickup details for userId:", userId);
    const response = await axiosInstance.get(TRASH_REQUEST_API.REQUEST_BY_USER_ID(userId));
    // console.log("response.data for pickup : ", response.data)
    return response.data?.data;
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
};


export const assignedTrashRequest = async (trashRequestId, pickerId) => {
  try {
    let obj = {
      "pickupRequestId": trashRequestId,
      "pickerId": pickerId
    }
    // console.log("Fetching scheduled pickup details for userId:", userId);
    const response = await axiosInstance.post(ADMIN_API.ASSIGNED_REQUEST, obj);
    // console.log("response.data for pickup : ", response.data)
    return response.data
  } catch (error) {
    console.error("API Call Failed:", error);
    throw error;
  }
}