import axiosInstance from '../axiosInstance';
import { WASTE_ENDPOINTS } from './endpoints/apiEndpoints';

// Fetch categories from the server
export const fetchCategories = async () => {
  const response = await axiosInstance.get(WASTE_ENDPOINTS.FETCH_WASTE_CATEGORIES_AND_PRICE);
  console.log("response : ", response)
  return response.data;
};

export const editPrice = async (priceData) => {
  const response = await axiosInstance.put(WASTE_ENDPOINTS.EDIT_PRICE, priceData);
  console.log("response : ", response)
  return response.data;
}

export const uploadPrice = async (priceData) => {
  const response = await axiosInstance.post(WASTE_ENDPOINTS.UPLOAD_PRICE, priceData);
  console.log("response : ", response)
  return response.data;
}