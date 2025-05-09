import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonalInfoStep from "./PersonalInfoStep";
import PickupInfoStep from "./PickupInfoStep";
import PreviewStep from "./PreviewStep";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { firebaseApp } from "../../service/firbaseService";
import { authenticateUser } from "../../service/apiServices/authService";
import { saveTokens } from "../../utils/tokensUtils";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/slice/registrationSlice";
import { formatToYMDWithSlashes } from "../../utils/dateFormatter";

const steps = ["Personal Info", "Pickup Info", "Preview & Confirm"];

const StepFormDialog = ({ onClose, initialPhoneNumber }) => {
  const dispatch = useDispatch();
  const auth = getAuth(firebaseApp);
  const recaptchaRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: initialPhoneNumber,
    emailId: "",
    pickupDate: "",
    pickupTime: "",
    address: "",
    city: "",
    postcode: "",
    landmark: "",
    estimatedWeight: "",
    selectedWasteTypes: [],
    wasteQuantities: {},
    userId: "",
  });

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

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (activeStep === steps.length - 1) {
      handleSendOTP();
      setShowOtp(true);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (showOtp) {
      setShowOtp(false);
    } else {
      setActiveStep((prev) => prev - 1);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = "Enter a valid 10-digit phone number";
      }
      if (!formData.emailId.trim()) newErrors.emailId = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId))
        newErrors.emailId = "Invalid email";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.postcode.trim())
        newErrors.postcode = "PIN Code is required";
      else if (!/^\d{6}$/.test(formData.postcode))
        newErrors.postcode = "Must be 6 digits";
    }
    if (activeStep === 1) {
      if (!formData.pickupDate)
        newErrors.pickupDate = "Pickup date is required";
      if (!formData.pickupTime)
        newErrors.pickupTime = "Pickup time is required";
      if (
        !formData.selectedWasteTypes ||
        formData.selectedWasteTypes.length === 0
      ) {
        newErrors.selectedWasteTypes = "Select at least one type of waste";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(
        auth,
        `+91${formData.phoneNumber}`,
        appVerifier
      );
      setConfirmationResult(result);
      showSnackbar("OTP sent successfully", "success");
    } catch (err) {
      console.error("OTP sending error:", err);
      showSnackbar("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
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
      return true;
    } catch (err) {
      console.error("OTP verification failed:", err);
      showSnackbar("Invalid or expired OTP.", "error");
      return false;
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

  const handleSubmit = async () => {
    const verified = await verifyOTP();
    if (!verified) return;

    setLoading(true);
    try {
      await fetchAccessToken();

      const registerationData = {
        "firstName": formData.firstName,
        "lastName": formData.lastName,
        "address": formData.address,
        "pickupDate": formatToYMDWithSlashes(formData.pickupDate),
        "approxPickupTime": formData.pickupTime,
        "phoneNumber": `+91${formData.phoneNumber}`,
        "emailId": formData.emailId,
        "nearLandMark": formData.landmark,
        "weight": formData.estimatedWeight,
        "city": formData.city,
        "postcode": formData.postcode,
        "type": formData.wasteQuantities
      }

      console.log("registerationData : ", registerationData);
      const response = await dispatch(registerUser(registerationData)).unwrap();

      console.log("response : ", response);
      showSnackbar(response, "success");


      onClose?.();
    } catch (error) {
      console.error("Submit error:", error);
      showSnackbar("Submission failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    if (showOtp) {
      return (
        <div className="flex flex-col gap-4">
          <Typography variant="h6">Enter OTP</Typography>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Verify & Submit"}
          </Button>
        </div>
      );
    }

    switch (activeStep) {
      case 0:
        return (
          <PersonalInfoStep
            formData={formData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 1:
        return (
          <PickupInfoStep
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <PreviewStep
            formData={formData}
            onNext={handleNext}
            setShowOtp={setShowOtp}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen px-4 py-2 sm:px-8 sm:py-10">
      {!showOtp && (
        <div className="mb-6">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="caption">{label}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

      <div className="flex justify-between pt-6">
        <Button onClick={handleBack} disabled={activeStep === 0 && !showOtp}>
          Back
        </Button>
        {!showOtp && (
          <Button variant="contained" onClick={handleNext} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              "Confirm"
            ) : (
              "Next"
            )}
          </Button>
        )}
      </div>

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

export default StepFormDialog;
