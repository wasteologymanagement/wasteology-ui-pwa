// src/services/otpService.js
import axiosInstance from "../axiosInstance";
import { AUTH_API } from "./endpoints/apiConstants";

// Request OTP
export const requestOtpApi = async (mobileNumber) => {
  const response = await axiosInstance.post(AUTH_API.OTP.REQUEST, {
    mobileNumber,
    purpose: "LOGIN",
  });

  return {
    success: response.data.success,
    message: response.data.message,
    requestId: response.data.requestId || null,
  };
};

// Verify OTP
export const verifyOtpApi = async (mobileNumber, otp) => {
  const response = await axiosInstance.post(AUTH_API.OTP.VERIFY, {
    mobileNumber,
    otp,
    purpose: "LOGIN",
  });

  return {
    success: true,
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    tokenType: response.data.tokenType,
    role: response.data.role,
    userDetails: {
      email: response.data.email,
      userId: response.data.userId,
      name: response.data.name,
    },
    message: response.data.message,
  };
};

// Resend OTP
export const resendOtpApi = async (mobileNumber) => {
  const response = await axiosInstance.post(AUTH_API.OTP.RESEND, {
    mobileNumber,
    purpose: "LOGIN",
  });

  return {
    success: response.data.success,
    message: response.data.message,
  };
};

