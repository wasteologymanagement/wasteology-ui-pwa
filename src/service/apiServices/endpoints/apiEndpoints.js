// services/apiEndpoints.js

export const API_BASE_URL = 'https://wasteology.in/apiWasteology';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  GENERATE_TOKEN: `${API_BASE_URL}/v1/admin/generate-token`,
  LOGIN: `${API_BASE_URL}/v1/login/authorize`
};

// User Endpoints
export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/v1/userTrash/userByMobileNumber`,
  REGISTER_PROFILE: `${API_BASE_URL}/v1/userTrash/register`,
  ADD_ADDRESS: `${API_BASE_URL}/v1/userTrash/addUserAddress`,
  EDIT_ADDRESS: `${API_BASE_URL}/v1/userTrash/editAddress`,
  DELETE_ADDRESS: `${API_BASE_URL}/v1/userTrash/deleteAddress`,
  SCHEDULE_PICK_UP: `${API_BASE_URL}/v1/userTrash/getScheduledPickup`
};

// Waste Management Endpoints
export const WASTE_ENDPOINTS = {
  FETCH_WASTE_CATEGORIES_AND_PRICE: `${API_BASE_URL}/v1/price/getPrice`,
  EDIT_PRICE: `${API_BASE_URL}/v1/price/editPrice`,
  UPLOAD_PRICE: `${API_BASE_URL}/v1/price/upload`,
  FETCH_WASTE_TYPES: `${API_BASE_URL}/v1/trash/trashType`,
  FETCH_WASTE_NAMES: `${API_BASE_URL}/v1/trash/trashNames`
  // GET_PICKUP_HISTORY: `${API_BASE_URL}/waste/pickup/history`,
};  

export const SCHEDULE_PICK_UP_ENDPOINTS = {
  GET_SCHEDULED_PICK_UPS: `${API_BASE_URL}/v1/userTrash/getScheduledPickup`,
  SUBMIT_PICKUP_REQUEST: `${API_BASE_URL}/v1/userTrash/trashRequest`,

}

export const TRASH_REQUEST_ENDPOINTS = {
  GET_TRASH_REQUESTS: `${API_BASE_URL}/v1/trashCollectionRequests/collectionRequests`,
  MAP_TRASH_REQUEST_TO_TRASH_PICKER: `${API_BASE_URL}/v1/trashPicker/mapRequest`,
  GET_TRASH_PICKER: `${API_BASE_URL}/v1/trashPicker/get-trashPickers`,
  GET_TRASH_REQUEST_FOR_TRASH_PICKERS: `${API_BASE_URL}/v1/trashPickerDashBoard/getTrashRequests`,
  GET_TRASH_DETAILS_FOR_PICKERS: `${API_BASE_URL}/v1/trashPicker/get-trashDetails`,
  SUBMIT_TRASH_DETAILS: `${API_BASE_URL}/v1/trashPicker/trashSubmit`,
  GET_TRASH_DETAILS_AFTER_PICKUP: `${API_BASE_URL}/v1/trashPicker/get-trashDetailsAfterPickup`,
}

// Other Service Endpoints (if any)
export const OTHER_SERVICE_ENDPOINTS = {
  CONTACT_US: `${API_BASE_URL}/v1/contact/saveContact`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/v1/dashboard`
};

// Export all endpoint groups together for easier imports
export default {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  WASTE_ENDPOINTS,
  OTHER_SERVICE_ENDPOINTS,
  TRASH_REQUEST_ENDPOINTS
};
