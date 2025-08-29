import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userLoginPng from "../../assets/user_login.png";
import { Snackbar, Alert } from "@mui/material";
import {
  getAuth,
  RecaptchaVerifier,
} from "firebase/auth";
import { firebaseApp } from "../../service/firbaseService";
import { authenticateUser } from "../../service/apiServices/authService";
import { saveTokens } from "../../utils/tokensUtils";
import { useDispatch } from "react-redux";
import {
  fetchUserByPhoneNumber,
  loginSuccess,
} from "../../store/slice/userSlice";

const UserLoginPage = () => {
  const location = useLocation();
  const phone = location.state?.phone || "";
  const [mobileNumber, setMobileNumber] = useState(phone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [confirmationResult, setConfirmationResult] = useState(null);
  const auth = getAuth(firebaseApp);
  const recaptchaRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const dispatch = useDispatch();

  const isValidMobile = (num) => /^(\+91)?[6-9]\d{9}$/.test(num);

  useEffect(() => {
    setupRecaptcha();
    // eslint-disable-next-line
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaRef.current,
        {
          size: "invisible",
          callback: () => {},
        }
      );
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSendOtp = async () => {
    if (!isValidMobile(mobileNumber)) {
      showSnackbar("Please enter a valid Indian mobile number", "warning");
      return;
    }

    setLoading(true);
    try {
      // const appVerifier = window.recaptchaVerifier;
      // const result = await signInWithPhoneNumber(
      //   auth,
      //   `+91${mobileNumber}`,
      //   appVerifier
      // );
      // setConfirmationResult(result);
      setOtpSent(true);
      showSnackbar("OTP sent successfully", "success");
    } catch (err) {
      console.error("OTP sending error:", err);
      showSnackbar("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      showSnackbar("Please enter all 6 digits.", "warning");
      return;
    }

    // if (!confirmationResult) {
    //   showSnackbar("OTP confirmation not initialized.", "error");
    //   return;
    // }

    setLoading(true);

    try {
      // await confirmationResult.confirm(otp);
      // showSnackbar("OTP verified", "success");
      // const tokens = await fetchAccessToken();

      // const fullPhone = `+91${mobileNumber}`;
      // const userData = await dispatch(
      //   fetchUserByPhoneNumber(fullPhone)
      // ).unwrap();

      // dispatch(loginSuccess(userData));
      showSnackbar("Login successful", "success");

      setTimeout(() => {
        setLoading(false);
        navigate("/app/user/schedule");
      }, 500);
    } catch (err) {
      console.error("OTP verification failed:", err);
      showSnackbar("Invalid or expired OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessToken = async () => {
    try {
      const response = await authenticateUser();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      {/* Card */}
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <img
            src={userLoginPng}
            alt="Login Illustration"
            className="h-24 sm:h-28 mx-auto"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500">
            Login using your mobile number
          </p>
        </div>

        {/* Input Section */}
        {!otpSent ? (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Mobile Number
              </label>
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <span className="bg-gray-100 text-gray-700 px-3 flex items-center text-sm">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={mobileNumber}
                  maxLength={10}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full font-semibold transition duration-150"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl outline-none text-sm"
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-full font-semibold transition duration-150"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </>
        )}
      </div>

      {/* Footer Text */}
      <p className="text-xs text-gray-400 text-center mt-6 max-w-xs">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer">Terms</span> and{" "}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>

      <div ref={recaptchaRef} />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserLoginPage;
