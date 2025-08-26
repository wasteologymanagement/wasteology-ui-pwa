// 📦 Base URL for all API endpoints
// const API_BASE_URL = "http://localhost:9090/api/v1";
const API_BASE_URL = "http://185.199.53.13:9090//api/v1";

// 🔐 Auth API Endpoints
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,

  // OTP Auth
  OTP: {
    VERIFY: `${API_BASE_URL}/auth/otp/verify`,
    RESEND: `${API_BASE_URL}/auth/otp/resend`,
    REQUEST: `${API_BASE_URL}/auth/otp/request`,
  },
};

// 👤 User API Endpoints
export const USER_API = {
  // 🔹 Registration & OTP flow
  REQUEST_REGISTRATION: `${API_BASE_URL}/user/request-registration`,
  VERIFY_REGISTRATION: `${API_BASE_URL}/user/verify-registration`,
  REGISTER: `${API_BASE_URL}/user/register`,

  // 🔹 Get User
  GET_BY_ID: (userId) => `${API_BASE_URL}/user/${userId}`,
  GET_BY_MOBILE: `${API_BASE_URL}/user/by-mobile`,
  GET_BY_EMAIL: `${API_BASE_URL}/user/by-email`,

  // 🔹 Delete User
  SOFT_DELETE: (userId) => `${API_BASE_URL}/user/${userId}/soft`,
  PERMANENT_DELETE: (userId) => `${API_BASE_URL}/user/${userId}/permanent`,
};


// 📍 Address APIs (based on correct image structure)
export const ADDRESS_API = {
  CREATE: (userId) => `${API_BASE_URL}/addresses/user/${userId}`,
  UPDATE: (addressId, userId) => `${API_BASE_URL}/addresses/${addressId}/user/${userId}`,
  DELETE: (addressId, userId) => `${API_BASE_URL}/addresses/${addressId}/user/${userId}`,
};


// ♻️ Trash Material API Endpoints
export const TRASH_MATERIAL_API = {
  // Get trash material by ID
  GET_BY_ID: (id) => `${API_BASE_URL}/trash-materials/${id}`,

  // Update existing trash material
  UPDATE: (id) => `${API_BASE_URL}/trash-materials/${id}`,

  // Soft delete trash material
  SOFT_DELETE: (id) => `${API_BASE_URL}/trash-materials/${id}`,

  // Get all trash materials
  GET_ALL: `${API_BASE_URL}/trash-materials`,

  //Get all active and not deleted
  GET_ALL_ACTIVE_NOT_DELETED: `${API_BASE_URL}/trash-materials/get-active-not-deleted`,

  //Get activate soft delete material
  GET_ACTIVATE: (id) => `${API_BASE_URL}/trash-materials/${id}/activate`,

  // Create new trash material
  CREATE: `${API_BASE_URL}/trash-materials`,

  // Permanently delete trash material
  PERMANENT_DELETE: (id) => `${API_BASE_URL}/trash-materials/${id}/permanent`,
};


// 👑 Admin API Endpoints
export const ADMIN_API = {

  // 👤 All users (USER role)
  GET_USERS: `${API_BASE_URL}/admin/users`, 
  
  // 🧹 Trash pickers (PICKER role)
  GET_PICKERS: `${API_BASE_URL}/admin/pickers`, 

  // 🧑‍💼 All (admins, users, pickers)
  GET_ALL_USERS: `${API_BASE_URL}/admin/all`, 

  // 🧹 Get all Trash pickers
  GET_ALL_TRASH_PICKER: `${API_BASE_URL}/admin/trash-pickers`,

   // 🧹 Get Trash pickers by id
  GET_PICKER_BY_ID: (id) => `${API_BASE_URL}/admin/trash-pickers/${id}`, 
  
  // 🧹 Update Trash pickers by id
  UPDATE_PICKER_BY_ID: (id) => `${API_BASE_URL}/admin/trash-pickers/${id}`, 

  // 🧹 Trash pickers registration
  REGISTER_PICKER: `${API_BASE_URL}/admin/trash-pickers/register`, 

   // 🧹 soft delete Trash pickers by id
  SOFT_DELETE_PICKER_BY_ID: (id) => `${API_BASE_URL}/admin/trash-pickers/${id}/soft-delete`,

   // 🧹 Permanently delete Trash pickers by id
  PERMANENT_DELETE_PICKER_BY_ID: (id) => `${API_BASE_URL}/admin/trash-pickers/${id}/permanent-delete`,

  //Get activate soft delete trash picker
  GET_ACTIVATE_TRASH_PICKER: (id) => `${API_BASE_URL}/admin/trash-pickers/${id}/revoke`,
};


// 👤 User Trash request API Endpoints
export const TRASH_REQUEST_API = {

  // Submit trash request
  REQUEST_SUBMIT: `${API_BASE_URL}/user/pickup-request`,

// Fetch all request
  ALL_REQUESTS: `${API_BASE_URL}/user/all-pickup-requests`,
  
};

