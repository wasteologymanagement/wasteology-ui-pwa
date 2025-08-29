
import axiosInstance from "../axiosInstance";
import { ADMIN_API, PICKERS_API } from "./endpoints/apiConstants";

// Register a new trash picker
export const registerTrashPicker = async (trashPickerData) => {
    try {
        const response = await axiosInstance.post(ADMIN_API.REGISTER_PICKER, trashPickerData);
        return response.data;
    } catch (error) {
        console.error("Error registering trash picker:", error);
        throw error.response?.data || error.message;
    }
}

// Get all trash pickers
export const getAllTrashPickers = async () => {
    try {
        const response = await axiosInstance.get(ADMIN_API.GET_ALL_TRASH_PICKER);
        return response.data;
    } catch (error) {
        console.error("Error fetching trash pickers:", error);
        throw error.response?.data || error.message;
    }
}

// Get all trash pickers
export const getAllActiveTrashPickers = async () => {
    try {
        const response = await axiosInstance.get(ADMIN_API.GET_ALL_TRASH_PICKER);
        return response.data;
    } catch (error) {
        console.error("Error fetching trash pickers:", error);
        throw error.response?.data || error.message;
    }
}

// Get trash picker by ID
export const getTrashPickerById = async (id) => {
    try {
        const response = await axiosInstance.get(ADMIN_API.GET_PICKER_BY_ID(id));
        return response.data;
    } catch (error) {
        console.error(`Error updating trash picker ${id}:`, error);
        throw error.response?.data || error.message;
    }
}

// Update trash picker by ID
export const updateTrashPicker = async (id, updatedData) => {
    try {
        const response = await axiosInstance.put(ADMIN_API.UPDATE_PICKER_BY_ID(id), updatedData);
        return response.data;
    } catch (error) {
        console.error(`Error updating trash picker ${id}:`, error);
        throw error.response?.data || error.message;
    }
}

// Delete trash picker by ID
export const deleteTrashPicker = async (id) => {
    try {
        const response = await axiosInstance.delete(ADMIN_API.PERMANENT_DELETE_PICKER_BY_ID(id));
        return response.data;
    } catch (error) {
        console.error(`Error deleting trash picker ${id}:`, error);
        throw error.response?.data || error.message;
    }
}

// Delete trash picker by ID
export const softDeleteTrashPicker = async (id) => {
    try {
        const response = await axiosInstance.delete(ADMIN_API.SOFT_DELETE_PICKER_BY_ID(id));
        return response.data;
    } catch (error) {
        console.error(`Error deleting trash picker ${id}:`, error);
        throw error.response?.data || error.message;
    }
}

// 📌 Activate soft deleted trash material
export const activateSoftDeletedTrashPicker = async (id) => {
  const response = await axiosInstance.put(ADMIN_API.GET_ACTIVATE_TRASH_PICKER(id));
  return response.data;
};


// Get picker profile details
export const getPickerProfilebyPickerId = async (id) => {
    const response = await axiosInstance.get(PICKERS_API.PICKER_PROFILE(id));
    return response.data;
} 

// Get picker profile details by picker user id
export const getPickerProfilebyPickerUserId = async (id) => {
    const response = await axiosInstance.get(PICKERS_API.PICKER_PROFILE_BY_USERID(id));
    return response.data;
} 

