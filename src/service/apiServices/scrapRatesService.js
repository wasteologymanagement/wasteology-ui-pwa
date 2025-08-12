import axiosInstance from '../axiosInstance';
import { TRASH_MATERIAL_API } from './endpoints/apiConstants';
// import { WASTE_ENDPOINTS } from './endpoints/apiEndpoints';

// Fetch categories from the server
// export const fetchCategories = async () => {
//   const response = await axiosInstance.get(TRASH_MATERIAL_API.GET_ALL);
//   console.log("response : ", response.data)
//   return response.data;
// };

// export const editPrice = async (priceData) => {
//   const response = await axiosInstance.put(WASTE_ENDPOINTS.EDIT_PRICE, priceData);
//   console.log("response : ", response)
//   return response.data;
// }

// export const uploadPrice = async (priceData) => {
//   const response = await axiosInstance.post(WASTE_ENDPOINTS.UPLOAD_PRICE, priceData);
//   console.log("response : ", response)
//   return response.data;
// }




// 📌 Get all trash materials
export const getAllTrashMaterials = async () => {
  const response = await axiosInstance.get(TRASH_MATERIAL_API.GET_ALL);
  return response.data; // Expected to be { data: [...], message, ... }
};

// 📌 Get trash material by ID
export const getTrashMaterialById = async (id) => {
  const response = await axiosInstance.get(TRASH_MATERIAL_API.GET_BY_ID(id));
  return response.data;
};

// 📌 Create trash material
export const createTrashMaterial = async (payload) => {
  const response = await axiosInstance.post(TRASH_MATERIAL_API.CREATE, payload);
  return response.data;
};

// 📌 Update trash material
export const updateTrashMaterial = async (id, payload) => {
  const response = await axiosInstance.put(TRASH_MATERIAL_API.UPDATE(id), payload);
  return response.data;
};

// 📌 Soft delete trash material
export const softDeleteTrashMaterial = async (id) => {
  const response = await axiosInstance.delete(TRASH_MATERIAL_API.SOFT_DELETE(id));
  return response.data;
};

// 📌 Permanent delete trash material
export const permanentDeleteTrashMaterial = async (id) => {
  const response = await axiosInstance.delete(TRASH_MATERIAL_API.PERMANENT_DELETE(id));
  return response.data;
};
