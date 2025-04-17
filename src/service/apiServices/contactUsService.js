import axiosInstance from '../axiosInstance';
import { OTHER_SERVICE_ENDPOINTS } from './endpoints/apiEndpoints';

export const saveContactApi = async (formData) => {
    try {
        console.log("save contact data:", formData);
        const response = await axiosInstance.post(`/v1/contact/saveContact`, formData);
        console.log("response.data:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Call Failed:", error);
        throw error;
    }
};
