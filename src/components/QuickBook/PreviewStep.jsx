import React from "react";
import { Typography, Button, Box } from "@mui/material";

const formatKey = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const wasteUnits = {
  Paper: "kg",
  Metal: "kg",
  Glass: "kg",
  Plastic: "kg",
  Cardboard: "kg",
  Ac: "pc",
  Refrigerator: "pc",
  "Washing machine": "pc",
  "Car / inverter battery": "pc",
  "Tv / lcd / led / tft / monitor / cpu": "pc",
  "E-Waste": "pc",
  // Default fallback will be "pc" if not found
};

const PreviewStep = ({ formData, onNext }) => {
  // console.log("form data : ", formData);
  return (
    <Box className="bg-white p-6 rounded-xl">
      <Typography
        variant="h6"
        gutterBottom
        className="!text-gray-800 !font-bold !mb-4"
      >
        Confirm Your Details
      </Typography>

      <Box className="space-y-3 text-sm text-gray-700">
        {Object.entries(formData).map(([key, value]) => {
          if (
            key === "userId" ||
            key === "selectedWasteTypes" ||
            key === "wasteQuantities"
          )
            return null;

          const formattedValue = Array.isArray(value)
            ? value.join(", ")
            : typeof value === "object" && value !== null
            ? JSON.stringify(value, null, 2)
            : value || "-";

          return (
            <div
              key={key}
              className="flex justify-between border-b border-gray-100 pb-2"
            >
              <span className="font-medium text-gray-600">
                {formatKey(key)}
              </span>
              <span className="text-right">
                {key === "phoneNumber"
                  ? `+91-${formattedValue}`
                  : key === "pickupDate"
                  ? new Date(formattedValue).toLocaleDateString("en-GB")
                  : formattedValue}
              </span>
            </div>
          );
        })}

        {/* Custom Merged Waste Summary */}
        {formData.selectedWasteTypes?.length > 0 && (
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2">Waste Summary : </p>
            <ul className="space-y-1 list-disc list-inside text-gray-800 text-sm">
              {formData.selectedWasteTypes.map((type) => {
                const quantity = formData.wasteQuantities[type] || 0;
                const unit = wasteUnits[type] || "pc";
                return (
                  <li key={type}>
                    {type} — {quantity} {unit}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default PreviewStep;
