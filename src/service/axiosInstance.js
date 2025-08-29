import axios from 'axios';
import { getAccessToken, getRefreshToken, updateTokens, removeTokens } from '../utils/tokensUtils';
import { AUTH_ENDPOINTS, API_BASE_URL } from './apiServices/endpoints/apiEndpoints';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token to every request
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

// Handle token refresh + error normalization
axiosInstance.interceptors.response.use(
  (response) => response, // ✅ success responses stay unchanged
  async (error) => {
    const originalRequest = error.config;

    // 🔄 Token refresh flow
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeTokens();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });

        const { access_token, refresh_token } = data;
        updateTokens({ accessToken: access_token, refreshToken: refresh_token });

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        removeTokens();
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // 🔴 Normalize all other errors (400, 403, 404, 500...)
    if (error.response) {
      return Promise.reject({
        success: error.response.data?.success ?? false,
        message: error.response.data?.message || 'Something went wrong',
        status: error.response.status,
        data: error.response.data?.data || null,
      });
    }

    // 🚨 Network / no response
    return Promise.reject({
      success: false,
      message: error.message || 'Network error',
      status: 0,
      data: null,
    });
  }
);

export default axiosInstance;
