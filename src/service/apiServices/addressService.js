import axiosInstance from '../axiosInstance';
import { ADDRESS_API } from './endpoints/apiConstants';


export const addAddressApi = async (formData) => {
    try {
        console.log("Add user address data:", formData);
        const response = await axiosInstance.post(ADDRESS_API.CREATE(formData.userId), formData);
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
        // const response = await axiosInstance.put(`${USER_ENDPOINTS.EDIT_ADDRESS}/${userId}/${userAddressId}`, formData);
        const response = await axiosInstance.put(ADDRESS_API.UPDATE(userAddressId, userId), formData);
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
        // const response = await axiosInstance.delete(`${USER_ENDPOINTS.DELETE_ADDRESS}/${userId}/${addressId}`);
        const response = await axiosInstance.delete(ADDRESS_API.DELETE(addressId, userId));
        // console.log("response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
};
