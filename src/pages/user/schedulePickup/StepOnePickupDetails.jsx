import React, { useState } from "react";
import AddAddressModal from "../../../components/AddEditAddressModal";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, addAddress } from "../../../store/slice/userSlice";

const StepOnePickupDetails = ({ data, setData, onNext }) => {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const userId = authState?.userId;

  const userDetails = useSelector(selectUser);
  const savedAddresses = userDetails?.addresses || [];

  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddAddress = (newAddr) => {
    dispatch(addAddress({ userId, address: newAddr }));

    const mergedAddress = [
      newAddr.addressLine1,
      newAddr.addressLine2,
      newAddr.street,
      newAddr.city,
      newAddr.state,
      newAddr.country,
      newAddr.zip,
    ]
      .filter(Boolean)
      .join(", ");

    setData({
      ...data,
      addressId: newAddr.addressId,
      address: mergedAddress,
      city: newAddr.city,
      pinCode: newAddr.zip,
    });
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
      const value = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")} ${ampm}`;
      options.push({ value, label });
      startDate.setMinutes(startDate.getMinutes() + intervalMinutes);
    }

    return options;
  };

  const handleNext = () => {
    const { pickupDate, pickupTime, addressId, city } = data;
    if (!pickupDate || !pickupTime || !addressId || !city) {
      setError("Please fill all the fields.");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Pickup Date */}
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

      {/* Pickup Time */}
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

      {/* Pickup Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pickup Address
        </label>
        {savedAddresses.length > 0 ? (
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
            value={data.addressId || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "add_new") {
                setModalOpen(true);
                return;
              }

              const selected = savedAddresses.find(
                (a) => a.addressId.toString() === value.toString()
              );
              if (selected) {
                const mergedAddress = [
                  selected.addressLine1,
                  selected.addressLine2,
                  selected.street,
                  selected.city,
                  selected.state,
                  selected.country,
                  selected.zip,
                ]
                  .filter(Boolean)
                  .join(", ");

                setData({
                  ...data,
                  addressId: selected.addressId,
                  address: mergedAddress,
                  city: selected.city,
                  pinCode: selected.zip,
                });
              }
            }}
          >
            <option value="">Select address</option>
            {savedAddresses.map((addr) => {
              const mergedAddress = [
                addr.addressLine1,
                addr.addressLine2,
                addr.street,
                addr.city,
                addr.state,
                addr.country,
                addr.zip,
              ]
                .filter(Boolean)
                .join(", ");
              return (
                <option key={addr.addressId} value={addr.addressId}>
                  {mergedAddress}
                </option>
              );
            })}
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

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <select
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
        >
          <option value="">Select City</option>
          <option value="Delhi">Delhi</option>
          <option value="Gurugram">Gurugram</option>
        </select>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Landmark
        </label>
        <input
          type="text"
          placeholder="e.g. Near Huda City Centre"
          value={data.landmark || ""}
          onChange={(e) => setData({ ...data, landmark: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
        />
      </div>

      {/* Estimated Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Weight
        </label>
        <select
          value={data.approxWeight || ""}
          onChange={(e) => setData({ ...data, approxWeight: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm"
        >
          <option value="">Select Estimated Weight</option>
          <option value="less_than_20">less_than_20 kg</option>
          <option value="21-50">21-50 kg</option>
          <option value="51-100">51-100 kg</option>
          <option value="101-700">101-700 kg</option>
          <option value="more_than_700">more_than_700 kg</option>
        </select>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl"
      >
        Next
      </button>

      {/* Add Address Modal */}
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
