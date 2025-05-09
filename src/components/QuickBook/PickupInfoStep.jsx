import React from "react";
import { Grid } from "@mui/material";

const wasteTypes = [
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
];

const PickupInfoStep = ({ formData, setFormData, handleChange, errors }) => {
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
        .padStart(2, "0")} ${hr >= 12 ? "PM" : "AM"}`;
      opts.push({ label, value });
      s.setMinutes(s.getMinutes() + interval);
    }

    return opts;
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="pickupDate"
            className="text-sm font-medium text-gray-700"
          >
            Pickup Date
          </label>
          <input
            type="date"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange("pickupDate")}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.pickupDate
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.pickupDate && (
            <p className="text-sm text-red-500 mt-1">{errors.pickupDate}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="pickupTime"
            className="text-sm font-medium text-gray-700"
          >
            Pickup Time
          </label>
          <select
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange("pickupTime")}
            className={`w-full border px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 ${
              errors.pickupTime
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select Time</option>
            {generateTimeOptions("10:00", "17:00", 30).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.pickupTime && (
            <p className="text-sm text-red-500 mt-1">{errors.pickupTime}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="estimatedWeight"
            className="text-sm font-medium text-gray-700"
          >
            Estimated Weight (kg)
          </label>
          <select
            name="Estimated Weight"
            value={formData.estimatedWeight}
            onChange={handleChange("estimatedWeight")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Estimated Weight</option>
            <option value="less_than_20">less_than_20 kg</option>
            <option value="21-50">21-50 kg</option>
            <option value="51-100">51-100 kg</option>
            <option value="100-700">100-700 kg</option>
            <option value="more_than_700">More than 700 kg</option>
          </select>
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold mb-2 mt-2 text-gray-500">
            Select Waste Types and Quantities
          </h3>
          <div className={`border ${
              errors.selectedWasteTypes
                ? "border-red-500"
                : "border-gray-300"
            } rounded-md`}>
            {wasteTypes.map((type) => {
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
                  className="p-1 flex justify-between items-center"
                >
                  <span className="text-md font-medium text-gray-800">
                    {type}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={decrement}
                      disabled={quantity === 0}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-red-500 text-white disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{quantity}</span>
                    <button
                      type="button"
                      onClick={increment}
                      className="w-8 h-8 flex items-center justify-center rounded-md bg-green-500 text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
            {errors.selectedWasteTypes && (
              <p className="text-sm text-red-500 mt-1">
                {errors.selectedWasteTypes}
              </p>
            )}
        </div>
      </Grid>
    </Grid>
  );
};

export default PickupInfoStep;
