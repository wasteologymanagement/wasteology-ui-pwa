import axios from 'axios';
import { getAccessToken, getRefreshToken, updateTokens, removeTokens } from '../utils/tokensUtils';
import { AUTH_ENDPOINTS, API_BASE_URL } from './apiServices/endpoints/apiEndpoints';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach the access token to all requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh if access token has expired
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the response is 401 Unauthorized and hasn't been retried, attempt to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          // Refresh token endpoint request
          const { data } = await axios.post(AUTH_ENDPOINTS.GENERATE_TOKEN, {
            "password": "admin",  // This should be dynamically fetched or securely handled
            "refreshToken": refreshToken,
          });

          // Update tokens and retry the original request with new access token
          const { access_token, refresh_token } = data;
          updateTokens({ accessToken: access_token, refreshToken: refresh_token });

          axiosInstance.defaults.headers.Authorization = `Bearer ${data.access_token}`;
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

          return axiosInstance(originalRequest);

        } catch (refreshError) {
          // If token refresh fails, remove tokens and redirect to login
          removeTokens();
          console.error('Session expired. Please log in again.');
          
          // Use useNavigate for React Router-based redirection
          // You can use `navigate` inside a component, not directly in axios instance.
          // This is a bit tricky since axiosInstance isn't aware of React Router hooks,
          // so you would have to manage redirection differently here, potentially dispatching a Redux action or using a global event.
          window.location.href = '/'; // Fallback to window.location.href for now (full page reload)
        }
      } else {
        // If no refresh token, remove tokens and redirect to login
        removeTokens();
        console.error('No refresh token available, please log in.');
        window.location.href = '/'; // Fallback to window.location.href for now
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
