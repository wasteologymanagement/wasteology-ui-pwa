import React, { useState } from "react";
import AddAddressModal from "../../../components/AddEditAddressModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StepOnePickupDetails = ({ data, setData, onNext }) => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [savedAddresses, setSavedAddresses] = React.useState(
    user?.userAddress || []
  );
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleAddAddress = (newAddr) => {
    setSavedAddresses([...savedAddresses, newAddr]);
    setData({ ...data, address: newAddr.address, city: newAddr.city });
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

  const handleNext = () => {
    const { pickupDate, pickupTime, address, city } = data;
    if (!pickupDate || !pickupTime || !address || !city) {
      setError("Please fill all the fields.");
      return;
    }
    setError("");
    onNext();
  };

  console.log("data : ", data);

  return (
    <div className="space-y-2">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Date
        </label>
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={data.pickupDate}
          onChange={(e) => setData({ ...data, pickupDate: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Time (10AM–5PM)
        </label>
        <select
          value={data.pickupTime}
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Address
        </label>
        {savedAddresses.length > 0 ? (
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
            value={data.address}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "add_new") {
                navigate("/app/user/profile"); // Navigate to profile to add address
                return;
              }

              const selected = savedAddresses.find((a) => a.address === value);
              if (selected) {
                setData({
                  ...data,
                  addressId: selected.addressId,
                  address: selected.address,
                  city: selected.city,
                  pinCode: selected.pinCode,
                });
              }
            }}
          >
            <option value="">Select address</option>
            {savedAddresses.map((addr, idx) => (
              <option key={idx} value={addr.address}>
                {addr.address}, {addr.city}, {addr.pinCode}
              </option>
            ))}
            <option value="add_new">+ Add Address</option>
          </select>
        ) : (
          <div className="text-sm text-gray-600">
            No addresses found.
            <button
              onClick={() => setModalOpen(true)}
              className="ml-2 text-green-600 underline"
            >
              Add Address
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
        >
          <option value="">Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Gurugram">Gurugram</option>
        </select>
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Near Landmark
        </label>
        <input
          type="text"
          placeholder="e.g. Near Huda City Centre"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
          value={data.landmark}
          onChange={(e) => setData({ ...data, landmark: e.target.value })}
        />
      </div>

      {/* <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
          <span className="px-4 text-sm text-gray-600 bg-gray-100 border-r border-gray-300">
            +91
          </span>
          <input
            type="tel"
            placeholder="Enter phone number"
            className="flex-1 px-4 py-3 text-sm focus:outline-none"
            value={data.phoneNumber}
            onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
          />
        </div>
      </div> */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Weight
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-sm"
          value={data.estimatedWeight}
          onChange={(e) =>
            setData({ ...data, estimatedWeight: e.target.value })
          }
        >
          <option value="">Select Estimated Weight</option>
          <option value="less_than_20">less_than_20 kg</option>
          <option value="21-50">21-50 kg</option>
          <option value="51-100">51-100 kg</option>
          <option value="100-700">100-700 kg</option>
          <option value="more_than_700">more_than_700 kg</option>
        </select>
      </div>

      <button
        onClick={handleNext}
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"
      >
        Next
      </button>

      {/* <AddAddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddAddress}
      /> */}

      <AddAddressModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddAddress}
        mode="add"
      />
    </div>
  );
};

export default StepOnePickupDetails;
