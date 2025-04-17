import axiosInstance from '../axiosInstance';
import { USER_ENDPOINTS } from './endpoints/apiEndpoints';


export const addAddressApi = async (formData) => {
    try {
        console.log("Add user address data:", formData);
        const response = await axiosInstance.post(USER_ENDPOINTS.ADD_ADDRESS, formData);
        console.log("response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
};


export const editAddressApi = async (userId, userAddressId, formData) => {
    try {
        console.log("Edit user address data:", formData);
        // Make the PUT request with the URL and body data
        const response = await axiosInstance.put(`${USER_ENDPOINTS.EDIT_ADDRESS}/${userId}/${userAddressId}`, formData);
        console.log("response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
};


export const deleteAddressApi = async (userId, addressId) => {
    try {
        // console.log("Deleting user address with ID:", addressId, "for user ID:", userId);
        const response = await axiosInstance.delete(`${USER_ENDPOINTS.DELETE_ADDRESS}/${userId}/${addressId}`);
        // console.log("response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
};
