import React, { useState, useEffect, useRef } from "react";
import { Snackbar, Alert, Button, CircularProgress } from "@mui/material";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { firebaseApp } from "../service/firbaseService";
import { authenticateUser } from "../service/apiServices/authService";
import { saveTokens } from "../utils/tokensUtils";
import {
  fetchUserByPhoneNumber,
  loginSuccess,
  addAddress,
  editAddress,
  deleteAddress,
} from "../store/slice/userSlice";
import { registerUser } from "../store/slice/registrationSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const initialForm = {
  pickupDate: "",
  pickupTime: "",
  address: "",
  city: "",
  landmark: "",
  selectedWasteTypes: [],
  wasteQuantities: {},
  estimatedWeight: "",
  phoneNumber: "",
  userId: "",
  emailId: "",
  firstName: "",
  lastName: "",
};

const CustomDialog = ({ open, onClose, width = "max-w-2xl" }) => {
  if (!open) return null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialForm);
  const [pincode, setPincode] = useState("");
  const [pinCheckMsg, setPinCheckMsg] = useState("");
  const [isServiceable, setIsServiceable] = useState(true);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
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
  // const timerRef = useRef(null);

  useEffect(() => {
    setupRecaptcha();
    // sendOTP();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length === 6) {
        setIsCheckingPin(true);
        const response = await fakeCheckPincodeAPI(pincode);
        setIsServiceable(response.available);
        setPinCheckMsg(
          response.available
            ? "✅ Service available in your area."
            : "❌ Sorry, service is not available at this pincode."
        );
        setIsCheckingPin(false);
      } else {
        setPinCheckMsg("");
        setIsServiceable(true);
        setIsCheckingPin(false);
      }
    };

    checkPincode();
  }, [pincode]);

  const fakeCheckPincodeAPI = async (pin) => {
    await new Promise((res) => setTimeout(res, 1000));
    const available = /^11|12/.test(pin);
    return { available };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaRef.current,
        { size: "invisible", callback: () => {} }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields (adjust as needed if some can be optional)
    const requiredFields = [
      "pickupDate",
      "pickupTime",
      "address",
      "city",
      "selectedWasteTypes",
      "estimatedWeight",
      "phoneNumber",
      "firstName",
      "lastName",
      "emailId",
    ];

    // Check for missing values
    // const missingFields = requiredFields.filter((field) => {
    //   const value = formData[field];
    //   if (Array.isArray(value)) {
    //     return value.length === 0;
    //   }
    //   return !value;
    // });

    // if (missingFields.length > 0) {
    //   setError("Please fill all the fields.");
    //   return;
    // }

    if (!isServiceable) return;

    setIsLoading(true);
    console.log("Submitted:", { ...formData, pincode });

    // setTimeout(() => {
    //   setIsLoading(false);
    //   setShowOtpInput(true); // Show OTP section
    // }, 1000);
    try {
      // const appVerifier = window.recaptchaVerifier;
      // const result = await signInWithPhoneNumber(
      //   auth,
      //   `+91${formData.phoneNumber}`,
      //   appVerifier
      // );
      // setConfirmationResult(result);
      showSnackbar("OTP sent successfully", "success");
      setIsLoading(false);
      setShowOtpInput(true); // Show OTP section
      // setTimer(180);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      showSnackbar("Please enter all 6 digits.", "warning");
      return;
    }
    console.log("OTP Submitted:", otp);
    setLoading(true);
    try {
      // await confirmationResult.confirm(code);
      showSnackbar("OTP verified", "success");
      setOtp("");
      // setIsVerified(true); // Stop timer and disable resend
      // clearInterval(timerRef.current);
      // setTimeout(() => {
      //   onVerified(); // Navigate to next screen
      // }, 100);
      const tokens = await fetchAccessToken();
      const userInfo = await handleCheckUser();
      if (userInfo?.status === 404) {
        //if user not found, register
        const registerationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          phoneNumber: `+91${formData.phoneNumber}`,
          emailId: formData.emailId,
          city: formData.city,
          postcode: pincode,
        };

        console.log("pincode : ", pincode);
        const response = await dispatch(registerUser(registerationData)).unwrap();

        console.log("response : ",response)

        //Then submit trash request
      } else {
        //Add address first then fetch details and filter address for addressID fro user state
        //Submit trash request
      }
      onClose(); // You can replace this with your verification logic
    } catch (err) {
      console.error(err);
      showSnackbar("Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessToken = async () => {
    try {
      const password = "admin";
      const response = await authenticateUser(password);
      if (!response || !response.accessToken) {
        throw new Error("Authentication failed.");
      }

      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      return {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      console.error("Error fetching token:", error);
      throw error;
    }
  };

  const handleCheckUser = async () => {
    try {
      const prefixPhoneNumber = `+91${formData.phoneNumber}`;
      const userData = await dispatch(
        fetchUserByPhoneNumber(prefixPhoneNumber)
      ).unwrap();
      return userData;
      // // Explicitly check for 404 status
      // if (userData?.status === 404) {
      //   //if user not found open registration form component
      //   navigate("/signup", {
      //     state: { phone }, // 👈 Pass it like this
      //   });
      // } else {
      //   dispatch(loginSuccess(userData));
      //   navigate("/app/user/schedule");
      // }
    } catch (error) {
      // dispatch(loginFailure());
      console.error("Error checking user:", error);
    }
  };

  const generateTimeOptions = (start, end, interval) => {
    const opts = [];
    let [sh, sm] = start.split(":").map(Number);
    let [eh, em] = end.split(":").map(Number);
    const s = new Date();
    s.setHours(sh, sm);
    const e = new Date();
    e.setHours(eh, em);

    while (s <= e) {
      const hr = s.getHours();
      const min = s.getMinutes();
      const label = `${hr % 12 || 12}:${min.toString().padStart(2, "0")} ${
        hr >= 12 ? "PM" : "AM"
      }`;
      const value = `${hr.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}`;
      opts.push({ label, value });
      s.setMinutes(s.getMinutes() + interval);
    }

    return opts;
  };

  return (
    <>
      {!showOtpInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-none px-4 mt-6">
          <div
            className={`bg-white w-full ${width} rounded-2xl shadow-lg animate-fadeIn overflow-hidden`}
          >
            {/* Header */}
            <div className="relative px-5 py-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center">
                📦 Scrap Pickup Booking
              </h2>
              <button
                onClick={onClose}
                className="absolute right-4 top-3 text-gray-400 hover:text-gray-500 hover:border border-dashed p-1 transition"
              >
                ✕
              </button>
            </div>
            {error && <p className="text-red-500 text-sm px-5">{error}</p>}
            {/* Form Content */}
            <form className="px-5 py-4 space-y-2 text-sm text-gray-700">
              {/* Name */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>

              {/* Phone + Email */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-full flex border rounded-md overflow-hidden">
                  <span className="px-3 py-2 bg-gray-100 text-sm flex items-center">
                    🇮🇳 +91
                  </span>
                  <input
                    name="phoneNumber"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 text-sm outline-none"
                  />
                </div>
                <input
                  name="emailId"
                  type="email"
                  placeholder="Email"
                  value={formData.emailId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>

              {/* Address */}
              <textarea
                name="address"
                placeholder="Full Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md resize-none"
                rows={1}
              />

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Landmark */}
                <input
                  name="landmark"
                  placeholder="Nearby Landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md bg-white"
                >
                  <option value="">Select City</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gurgaon">Gurgaon</option>
                </select>
              </div>

              {/* City + Pincode */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Pincode"
                    className="w-full border px-3 py-2 rounded-md pr-10"
                  />
                  {isCheckingPin && (
                    <div className="absolute right-3 top-2.5 animate-spin h-5 w-5 border-t-2 border-blue-500 border-solid rounded-full" />
                  )}
                </div>
                <select
                  name="Estimated Weight"
                  value={formData.estimatedWeight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedWeight: e.target.value,
                    })
                  }
                  className="w-full border px-3 py-2 rounded-md bg-white"
                >
                  <option value="">Select Estimated Weight</option>
                  <option value="less_than_20">less_than_20 kg</option>
                  <option value="21-50">21-50 kg</option>
                  <option value="51-100">51-100 kg</option>
                  <option value="100-700">100-700 kg</option>
                  <option value="more_than_700">more_than_700 kg</option>
                </select>
              </div>

              {pinCheckMsg && (
                <p
                  className={`text-sm ${
                    isServiceable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {pinCheckMsg}
                </p>
              )}

              {/* Pickup Date + Time */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  name="pickupDate"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.pickupDate}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md"
                />
                <select
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md bg-white"
                >
                  <option value="">Select Time</option>
                  {generateTimeOptions("10:00", "17:00", 30).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Waste Types Placeholder */}
              <h3 className="text-sm font-semibold mb-2 text-gray-500">
                Select Scrap Types
              </h3>
              <div className="border rounded-md max-h-50 overflow-y-auto p-3 text-gray-700">
                <div className="flex flex-col gap-1">
                  {[
                    "Ac",
                    "Paper",
                    "Metal",
                    "Glass",
                    "E-Waste",
                    "Plastic",
                    "Cardboard",
                    "Refrigerator",
                    "Washing machine",
                    "Car / inverter battery",
                    "Tv / lcd / led / tft / monitor / cpu",
                  ].map((type) => {
                    const quantity = formData.wasteQuantities[type] || 0;

                    const increment = () =>
                      setFormData((prev) => ({
                        ...prev,
                        selectedWasteTypes: [
                          ...new Set([...prev.selectedWasteTypes, type]),
                        ],
                        wasteQuantities: {
                          ...prev.wasteQuantities,
                          [type]: quantity + 1,
                        },
                      }));

                    const decrement = () => {
                      const newQuantity = Math.max(0, quantity - 1);
                      const updatedTypes =
                        newQuantity === 0
                          ? formData.selectedWasteTypes.filter(
                              (t) => t !== type
                            )
                          : formData.selectedWasteTypes;

                      setFormData((prev) => ({
                        ...prev,
                        selectedWasteTypes: updatedTypes,
                        wasteQuantities: {
                          ...prev.wasteQuantities,
                          [type]: newQuantity,
                        },
                      }));
                    };

                    return (
                      <div
                        key={type}
                        className="rounded-lg px-3 py-2 flex justify-between items-center bg-gray-50 shadow-sm"
                      >
                        <span className="text-[15px] font-medium">{type}</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={decrement}
                            className="bg-red-500 text-white w-6 h-6 rounded disabled:opacity-50"
                            disabled={quantity === 0}
                          >
                            −
                          </button>
                          <span className="min-w-[24px] text-center">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={increment}
                            className="bg-green-500 text-white w-6 h-6 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Actions */}
            <div className="px-5 py-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="scrap-form"
                disabled={isLoading || !isServiceable}
                className={`px-4 py-2 rounded-md text-white transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={handleSubmit}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Input Section */}
      {showOtpInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit OTP sent to your phone number
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOtpInput(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={recaptchaRef} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomDialog;
