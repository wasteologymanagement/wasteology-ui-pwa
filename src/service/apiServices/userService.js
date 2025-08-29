import axiosInstance from '../axiosInstance';
import { USER_API } from './endpoints/apiConstants';
import { USER_ENDPOINTS } from './endpoints/apiEndpoints';

export const fetchUserDetails = async (phoneNumber) => {
  try {
    // Fetch user data by phone number
    const response = await axiosInstance.get(
      `${USER_ENDPOINTS.PROFILE}/${phoneNumber}`
    );

    // Return the data from the response if successful
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle specific errors based on response status
    if (error.response) {
      if (error.response.status === 404) {
        console.error(
          'User not found:',
          error.response.data.message ||
            'No user exists with this phone number.'
        );
        return { message: 'User not found', status: 404 };
      }
      console.error(
        'API Error:',
        error.response.status,
        error.response.data.message || 'Unknown error occurred.'
      );
    } else {
      console.error('Network/Server Error:', error.message);
    }

    // Re-throw error for further handling, if needed
    throw error;
  }
};

export const registerUserApi = async (formData) => {
  try {
    console.log('Registering user with data:', formData);
    const response = await axiosInstance.post(
      USER_ENDPOINTS.REGISTER_PROFILE,
      formData
    );
    console.log('response.data : ', response.data);
    return response.data;
  } catch (error) {
    console.error('API Call Failed:', error);
    throw error;
  }
};



// Fetch user details by user ID
export const fetchUserDetailsById = async (userId) => {
  const response = await axiosInstance.get(USER_API.GET_BY_ID(userId));
  return response.data;
};

// ✅ Fetch user details by phone number
export const fetchUserDetailsByPhoneNumber = async (phoneNumber) => {
  const response = await axiosInstance.get(
    `${USER_API.GET_BY_MOBILE}?mobile=${phoneNumber}`
  );
  return response.data;
};

