// PhoneCheckAndStepForm.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import StepFormDialog from "./StepFormDialog";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../../service/apiServices/authService";
import { saveTokens } from "../../utils/tokensUtils";
import { useDispatch } from "react-redux";
import { fetchUserByPhoneNumber } from "../../store/slice/userSlice";

const PhoneCheckAndStepForm = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showStepForm, setShowStepForm] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const fetchAccessToken = async () => {
    try {
      const response = await authenticateUser("admin");
      if (!response || !response.accessToken) {
        throw new Error("No access token");
      }
      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return response;
    } catch (error) {
      console.error("Token fetch error:", error);
      throw error;
    }
  };

  const handleCheckUser = async () => {
    setLoading(true);
    setError("");

    try {
      await fetchAccessToken();
      const fullPhone = `+91${phoneNumber}`;
      const userData = await dispatch(
        fetchUserByPhoneNumber(fullPhone)
      ).unwrap();

      if (userData?.status === 404) {
        // ❌ User doesn't exist — show step form for onboarding
        setShowStepForm(true);
      } else {
        // ✅ User exists — redirect to dashboard or home
        navigate("/login/customer", { state: { phone: phoneNumber } });
        onClose?.();
      }

    } catch (err) {
      console.error(err);
      setError("Failed to check user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showStepForm) {
    return <StepFormDialog initialPhoneNumber={phoneNumber} />;
  }

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-white shadow-lg rounded-lg md:mt-50">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Welcome to Wasteology
      </h2>
      <p className="text-gray-600 text-sm mb-4 text-center">
        Please enter your phone number to continue.
      </p>

      <div className="w-full flex border rounded-md overflow-hidden">
        <span className="px-3 py-2 bg-gray-100 text-sm flex items-center">
          🇮🇳 +91
        </span>
        <input
          name="phoneNumber"
          type="tel"
          maxLength={10}
          placeholder="10-digit number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="flex-1 px-3 py-2 text-sm outline-none"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        onClick={handleCheckUser}
        disabled={!phoneNumber || loading}
        className={`w-full mt-4 py-2 text-white rounded-md transition ${
          loading || !phoneNumber
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          </div>
        ) : (
          "Continue"
        )}
      </button>
    </div>
  );
};

export default PhoneCheckAndStepForm;
