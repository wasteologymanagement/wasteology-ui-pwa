import React, { useState, useRef, useEffect } from "react";
import { Snackbar, Alert, Button, CircularProgress } from "@mui/material";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { firebaseApp } from "../service/firbaseService";

const PhoneVerification = ({ phoneNumber, onVerified }) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes
  const auth = getAuth(firebaseApp);
  const recaptchaRef = useRef(null);
  const [isVerified, setIsVerified] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setupRecaptcha();
    sendOTP();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isVerified) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  
    return () => clearInterval(timerRef.current);
  }, [isVerified]);

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

  const sendOTP = async () => {
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        `+91${phoneNumber}`,
        appVerifier
      );
      setConfirmationResult(result);
      showSnackbar("OTP sent successfully", "success");
      setTimer(180);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otpDigits.join("");
    if (code.length !== 6) {
      showSnackbar("Please enter all 6 digits.", "warning");
      return;
    }
  
    setLoading(true);
    try {
      await confirmationResult.confirm(code);
      showSnackbar("OTP verified", "success");
      setOtpDigits(["", "", "", "", "", ""]);
      setIsVerified(true); // Stop timer and disable resend
      clearInterval(timerRef.current);
      setTimeout(() => {
        onVerified(); // Navigate to next screen
      }, 100);
    } catch (err) {
      console.error(err);
      showSnackbar("Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full px-4 py-2 sm:px-6 text-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        OTP Verification
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Enter the OTP sent to{" "}
        <span className="font-medium">+91 {phoneNumber}</span>
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {otpDigits.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-10 h-12 text-center border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <div className="flex flex-col items-center space-y-3">
        <Button
          variant="contained"
          onClick={verifyOTP}
          disabled={loading}
          className="w-full max-w-xs"
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Verify OTP"
          )}
        </Button>

        {timer > 0 ? (
          <span className="text-sm text-gray-500">
            Resend OTP in {formatTime(timer)}
          </span>
        ) : !isVerified ? (
          <Button
            variant="text"
            onClick={sendOTP}
            className="text-sm text-blue-600"
          >
            Resend OTP
          </Button>
        ) : null}
      </div>

      <div ref={recaptchaRef} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PhoneVerification;
