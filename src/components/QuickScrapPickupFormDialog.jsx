import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchScrapTypes } from "../service/apiServices/scrapTypeService";

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

const QuickScrapPickupFormDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState(initialForm);
  const [pincode, setPincode] = useState("");
  const [pinCheckMsg, setPinCheckMsg] = useState("");
  const [isServiceable, setIsServiceable] = useState(true);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wasteTypes, setWasteTypes] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const loadScrapTypes = async () => {
  //     try {
  //       const types = await fetchScrapTypes();
  //       setWasteTypes(types);
  //     } catch (error) {
  //       console.error("Failed to load scrap types:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadScrapTypes();
  // }, []);

  // console.log("waste Types : ", wasteTypes)

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
    const available = /^11|12/.test(pin); // Only '11xxx' and '12xxx' are serviceable
    return { available };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isServiceable) return;
    setIsLoading(true);
    // Handle the submission logic
    console.log("Submitted Data:", { ...formData, pincode });
    setTimeout(() => {
      setIsLoading(false);
      onClose(); // Close on success
    }, 1000);
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
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
        2,
        "0"
      )}`;
      options.push({ label, value });
      startDate.setMinutes(startDate.getMinutes() + intervalMinutes);
    }

    return options;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 4, p: 5 },
      }}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
        Register for Scrap Pickup
      </h2>

      <DialogContent className="space-y-4 max-w-md w-full mx-auto p-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Inputs */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg text-sm"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Email */}
          <input
            name="emailId"
            type="email"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />

          {/* Phone */}
          <div className="w-full flex border rounded-lg overflow-hidden">
            <span className="px-3 py-2 bg-gray-100 text-sm flex items-center select-none">
              🇮🇳 +91
            </span>
            <input
              name="phoneNumber"
              type="tel"
              maxLength={10}
              placeholder="10-digit number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
          </div>

          {/* Address */}
          <textarea
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg text-sm resize-none"
            rows={3}
          />

          {/* Landmark */}
          <input
            name="landmark"
            placeholder="Nearby Landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />

          {/* City and Pincode */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg text-sm bg-white"
            >
              <option value="">Select City</option>
              <option value="Delhi">Delhi</option>
              <option value="Gurgaon">Gurgaon</option>
            </select>

            <div className="relative w-full">
              <input
                type="text"
                name="pincode"
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Pincode"
                required
                className="w-full border px-3 py-2 rounded-lg text-sm pr-10"
              />
              {isCheckingPin && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 border-solid rounded-full"></div>
                </div>
              )}
            </div>
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

          {/* Pickup date and time */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              name="pickupDate"
              min={new Date().toISOString().split("T")[0]}
              value={formData.pickupDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-sm"
            />
            <select
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-sm"
            >
              <option value="">Select time</option>
              {generateTimeOptions("10:00", "17:00", 30).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Waste Types */}
          <div>
            <label className="text-sm font-bold mb-2 block">
              Select Scrap Types
            </label>
            <div className="grid grid-cols-1 gap-2">
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
                      ? formData.selectedWasteTypes.filter((t) => t !== type)
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
                    className="border rounded-lg p-1 flex justify-between items-center bg-gray-50"
                  >
                    <span className="text-sm font-medium">{type}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={decrement}
                        className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
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
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              disabled={isLoading}
              className="bg-gray-600 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition disabled:bg-gray-400 w-full"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isServiceable}
              className="bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition disabled:bg-gray-400 w-full"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickScrapPickupFormDialog;
