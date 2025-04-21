import React from "react";
import { formatToDMY } from "../../../utils/dateFormatter";

const StepThreeReviewAndSubmit = ({ data, onSubmit, onBack }) => {
  const handleSubmit = () => {
    // alert("Pickup request submitted!");
    onSubmit();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-8">
      <h2 className="text-xl font-bold text-gray-800 text-center">
        Confirm Your Pickup Request
      </h2>

      {/* Personal Info */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
          <div>
            <p className="text-gray-500">First Name</p>
            <p className="font-medium">{data.firstName}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Name</p>
            <p className="font-medium">{data.lastName}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{data.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone Number</p>
            <p className="font-medium">+91 {data.phoneNumber}</p>
          </div>
        </div>
      </section>

      {/* Pickup Info */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
          Pickup Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
          <div>
            <p className="text-gray-500">Pickup Date</p>
            <p className="font-medium">{formatToDMY(data.pickupDate)}</p>
          </div>
          <div>
            <p className="text-gray-500">Pickup Time</p>
            <p className="font-medium">{data.pickupTime}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{data.address}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium">{data.city}</p>
          </div>
          {data.landmark && (
            <div>
              <p className="text-gray-500">Nearby Landmark</p>
              <p className="font-medium">{data.landmark}</p>
            </div>
          )}
        </div>
      </section>

      {/* Waste Details */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
          Waste Items Summary
        </h3>
        <ul className="list-disc list-inside space-y-1 text-md text-gray-800">
          {data.selectedWasteTypes.map((wasteId) => {
            const wasteType = data.wasteTypes?.find(
              (w) => w.value === wasteId
            );
            const label = wasteType?.label || wasteId;
            const quantity = data.wasteQuantities[wasteId] || 0;
            const unit = [
              "e-waste",
              "WASHING_MACHINE",
              "AC",
              "REFRIGERATOR",
            ].includes(wasteId)
              ? "pc"
              : "kg";
            return (
              <li key={wasteId}>
                {label}: {quantity} {unit}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t pt-6">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-5 py-2 text-sm bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="w-full sm:w-auto px-5 py-2 text-sm bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
};

export default StepThreeReviewAndSubmit;
