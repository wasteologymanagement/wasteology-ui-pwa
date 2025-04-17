import axiosInstance from '../axiosInstance';
import { WASTE_ENDPOINTS } from './endpoints/apiEndpoints';

export const fetchScrapTypes = async () => {
  try {
    // console.log("Trash type data:");
    const response = await axiosInstance.get(WASTE_ENDPOINTS.FETCH_WASTE_TYPES);
    // Format the scrap types into the desired structure
    return response.data[0].map((type) => ({
      label: formatLabel(type),
      value: type,
    }));
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};

export const fetchScrapNames = async (wasteType) => {
  try {
    const response = await axiosInstance.get(`${WASTE_ENDPOINTS.FETCH_WASTE_NAMES}/${wasteType}`);
    return response.data[0].map((type) => ({
      label: formatLabel(type),
      value: type,
    }));
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
}

// Function to format label
const formatLabel = (text) => {
  return text
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
