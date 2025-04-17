import axiosInstance from '../axiosInstance';
import { TRASH_REQUEST_ENDPOINTS } from './endpoints/apiEndpoints';

export const getAllTrashRequestDetails = async (userId) => {
  try {
    // console.log("Fetching scheduled pickup details for userId:", userId);
    const response = await axiosInstance.get(
      `${TRASH_REQUEST_ENDPOINTS.GET_TRASH_REQUESTS}`
    );
    // console.log("response.data for pickup : ", response.data)
    return response.data;
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};

export const getAllTrashPickersDetails = async () => {
  try {
    // console.log("Fetching scheduled pickup details for userId:", userId);
    const response = await axiosInstance.get(
      `${TRASH_REQUEST_ENDPOINTS.GET_TRASH_PICKER}`
    );
    // console.log("response.data for pickup : ", response.data)
    return response.data;
  } catch (error) {
    console.log('API Call Failed:', error);
    throw error;
  }
};

export const getAllTrashRequestForPickers = async (userId) => {
  try {
    // console.log("Fetching scheduled pickup details for userId:", userId);
    const response = await axiosInstance.get(
      `${TRASH_REQUEST_ENDPOINTS.GET_TRASH_REQUEST_FOR_TRASH_PICKERS}?trashPickerId=${userId}`
    );
    // console.log("response.data for pickup : ", response.data)
    return response.data;
  } catch (error) {
    console.log('API call failed : ', error);
    throw error;
  }
}

export const assignTrashRequestWithTrashPicker = async (data) => {
  try {
    // console.log('Trash pickup request data:', formData);
    const response = await axiosInstance.post(
      TRASH_REQUEST_ENDPOINTS.MAP_TRASH_REQUEST_TO_TRASH_PICKER,
      data
    );
    // console.log('response.data : ', response.data);
    return response.data;
  } catch (error) {
    console.log('API call failed : ', error);
    throw error;
  }
};

export const getTrashDetailsForPickers = async (trashRequestId) => {
  try {
    // console.log("Fetching scheduled pickup details for userId:", userId);
    const response = await axiosInstance.get(
      `${TRASH_REQUEST_ENDPOINTS.GET_TRASH_DETAILS_FOR_PICKERS}?trashRequestId=${trashRequestId}`
    );
    // console.log("response.data for pickup : ", response.data)
    if (response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log('API call failed : ', error);
    throw error;
  }
}


export const submitTrashDetails = async (data) => {
  try {
    // console.log('Trash pickup request data:', formData);
    const response = await axiosInstance.post(
      TRASH_REQUEST_ENDPOINTS.SUBMIT_TRASH_DETAILS,
      data
    );
    // console.log('response.data : ', response.data);
    return response.data;
  } catch (error) {
    console.log('API call failed : ', error);
    throw error;
  }
};


export const TrashDetailsAfterPickup = async (trashRequestId) => {
  try {
    const response = await axiosInstance.get(
      `${TRASH_REQUEST_ENDPOINTS.GET_TRASH_DETAILS_AFTER_PICKUP}?trashRequestId=${trashRequestId}`
    );
    // console.log('response.data : ', response.data);
    return response.data;
  } catch (error) {
    console.log('API call failed : ', error);
    throw error;
  }
};
