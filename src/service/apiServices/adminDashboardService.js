import { axiosInstance } from '../axiosInstance';
import { OTHER_SERVICE_ENDPOINTS } from '../endpoints/apiEndpoints';

/**
 * Fetch admin dashboard data
 * @returns {Promise<Object>} Dashboard data including stats, alerts, and chart data
 */
export const adminDashboard = async () => {
  try {
    const response = await axiosInstance.get(OTHER_SERVICE_ENDPOINTS.ADMIN_DASHBOARD);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
  }
};

/**
 * Fetch waste collection statistics
 * @param {string} timeRange - Time range for statistics (daily, weekly, monthly)
 * @returns {Promise<Object>} Collection statistics
 */
export const fetchCollectionStats = async (timeRange = 'weekly') => {
  try {
    const response = await axiosInstance.get(`${OTHER_SERVICE_ENDPOINTS.COLLECTION_STATS}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch collection statistics');
  }
};

/**
 * Fetch revenue statistics
 * @param {string} timeRange - Time range for statistics (daily, weekly, monthly)
 * @returns {Promise<Object>} Revenue statistics
 */
export const fetchRevenueStats = async (timeRange = 'weekly') => {
  try {
    const response = await axiosInstance.get(`${OTHER_SERVICE_ENDPOINTS.REVENUE_STATS}?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch revenue statistics');
  }
};

/**
 * Fetch system alerts
 * @returns {Promise<Array>} List of system alerts
 */
export const fetchSystemAlerts = async () => {
  try {
    const response = await axiosInstance.get(OTHER_SERVICE_ENDPOINTS.SYSTEM_ALERTS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch system alerts');
  }
};

/**
 * Fetch user statistics
 * @returns {Promise<Object>} User statistics including total users, active users, etc.
 */
export const fetchUserStats = async () => {
  try {
    const response = await axiosInstance.get(OTHER_SERVICE_ENDPOINTS.USER_STATS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
  }
};

/**
 * Fetch pickup statistics
 * @returns {Promise<Object>} Pickup statistics including total pickups, active pickups, etc.
 */
export const fetchPickupStats = async () => {
  try {
    const response = await axiosInstance.get(OTHER_SERVICE_ENDPOINTS.PICKUP_STATS);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pickup statistics');
  }
};