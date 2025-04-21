import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialForm = {
  pickupDate: "",
  pickupTime: "",
  addressId: "",
  address: [],
  city: "",
  landmark: "",
  selectedWasteTypes: [],
  wasteQuantities: {},
  wasteTypes: [],
  estimatedWeight: "",
  phoneNumber: "",
  userId: "",
  email: "",
  firstName: "",
  lastName: "",
};

const QuickScrapPickupFormDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState(initialForm);
  const [pincode, setPincode] = useState("");
  const [pinCheckMsg, setPinCheckMsg] = useState("");
  const [isServiceable, setIsServiceable] = useState(true);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length === 6) {
        setIsCheckingPin(true);
        const response = await fakeCheckPincodeAPI(pincode);
        if (response.available) {
          setIsServiceable(true);
          setPinCheckMsg("✅ Service available in your area.");
        } else {
          setIsServiceable(false);
          setPinCheckMsg("❌ Sorry, service is not available at this pincode.");
        }
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
    const available = /^11|12/.test(pin); // Only '11xxx' and '12xxx' are serviceable
    return { available };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const generateTimeOptions = (start, end, intervalMinutes) => {
    const options = [];
    let [startHour, startMinute] = start.split(":").map(Number);
    let [endHour, endMinute] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    while (startDate <= endDate) {
      const hour = startDate.getHours();
      const minute = startDate.getMinutes();
      const ampm = hour >= 12 ? "PM" : "AM";
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )} ${ampm}`;
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
      options.push({ value, label });
      startDate.setMinutes(startDate.getMinutes() + intervalMinutes);
    }

    return options;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4, // 4 = 32px; adjust as needed
          p: 2,
        },
      }}
    >
      {/* <DialogTitle className="text-2xl font-semibold text-center  text-gray-800"> */}
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Register for Scrap Pickup
      </h2>
      {/* </DialogTitle> */}

      <DialogContent className="space-y-4">
        {/* Your dialog form fields or content here */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mx-auto bg-white p-2 flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 border px-3 py-2 rounded-lg text-sm"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 border px-3 py-2 rounded-lg text-sm"
            />
          </div>

          <input
            name="emailId"
            type="email"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />

          <div className="w-full flex border rounded-lg overflow-hidden">
            <span className="px-3 py-2 bg-gray-100 text-sm flex items-center select-none">
              🇮🇳 +91
            </span>
            <input
              name="phoneNumber"
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit number"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
          </div>

          <textarea
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg text-sm resize-none"
            rows={3}
          />

          <input
            type="text"
            placeholder="Near Lankmark "
            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
            value={formData.landmark}
            onChange={(e) => setData({ ...data, landmark: e.target.value })}
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 border px-3 py-2 rounded-lg text-sm bg-white"
            >
              <option value="">Select City</option>
              <option value="Delhi">Delhi</option>
              <option value="Gurgaon">Gurgaon</option>
            </select>

            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                name="postcode"
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Pincode"
                required
                className="w-full border px-3 py-2 rounded-lg text-sm pr-10"
              />
              {isCheckingPin && (
                <div className="absolute right-3 top-2.5">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {pinCheckMsg && (
            <p
              className={`text-sm -mt-2 ${
                isServiceable ? "text-green-600" : "text-red-600"
              }`}
            >
              {pinCheckMsg}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.pickupDate}
              onChange={(e) => setData({ ...data, pickupDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
            />
            <select
              value={formData.pickupTime}
              onChange={(e) => setData({ ...data, pickupTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
            >
              <option value="">Select a time</option>
              {generateTimeOptions("10:00", "17:00", 30).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </DialogContent>

      {/* <DialogActions className="flex gap-2 pt-4">
        <Button
          onClick={onClose}
          color="primary"
          disabled={isLoading}
          className="rounded-full"
        >
          Close
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isLoading}
          className="rounded-full"
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default QuickScrapPickupFormDialog;
