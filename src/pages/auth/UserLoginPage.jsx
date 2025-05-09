import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import userLoginPng from "../../assets/user_login.png";
import { Snackbar, Alert, Button, CircularProgress } from "@mui/material";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
        { size: "invisible", callback: () => {} }
      );
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSendOtp = async () => {
    if (!isValidMobile(mobileNumber)) {
      alert("Please enter a valid Indian mobile number");
      return;
    }

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        `+91${mobileNumber}`,
        appVerifier
      );
      setConfirmationResult(result);
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
      return false;
    }

    if (!confirmationResult) {
      showSnackbar("OTP confirmation not initialized.", "error");
      return false;
    }

    setLoading(true);

    try {
      await confirmationResult.confirm(otp);
      showSnackbar("OTP verified", "success");
      const tokens = await fetchAccessToken();

      const fullPhone = `+91${mobileNumber}`;
      const userData = await dispatch(
        fetchUserByPhoneNumber(fullPhone)
      ).unwrap();

      console.log("user Data : ", userData);

      // if (userData?.status === 404) {
      //   showSnackbar("New user. Redirecting to registration.", "info");
      //   // Handle redirection if needed
      // } else {
      showSnackbar("Login successful", "success");
      dispatch(loginSuccess(userData));
      setTimeout(() => {
        setLoading(false);
        navigate("/app/user/schedule");
      }, 500);
      // }
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 px-4  py-4 md:py-16 sm:px-6 md:px-8">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <img
            src={userLoginPng}
            alt="Login Vector"
            className="h-28 mx-auto mb-4 sm:h-36 md:h-40"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500">
            Login using your mobile number
          </p>
        </div>

        {!otpSent ? (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden mb-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-3 text-sm font-semibold">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                placeholder="9876543210"
                value={mobileNumber}
                maxLength={10}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="flex-1 px-3 py-2 outline-none"
              />
            </div>

            <button
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-3xl font-semibold"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Enter OTP
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4 outline-none"
            />

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </>
        )}
      </div>

      {/* Terms Paragraph at Bottom */}
      <p className="mt-4 text-xs text-gray-400 text-center max-w-md px-2">
        By continuing, you agree to our <span className="underline">Terms</span>{" "}
        and <span className="underline">Privacy Policy</span>.
      </p>

      <div ref={recaptchaRef} />

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
