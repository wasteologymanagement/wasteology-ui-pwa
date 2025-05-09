import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";

const cities = ["Delhi", "Gurugram", "Noida", "Faridabad", "Ghaziabad"];

const PersonalInfoStep = ({ formData, handleChange, errors }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="emailId"
            className="text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="emailId"
            name="emailId"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleChange("emailId")}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.emailId
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.emailId && (
            <p className="text-sm text-red-500 mt-1">{errors.emailId}</p>
          )}
        </div>
      </Grid>

      {/* show when user not registered */}
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1 w-full">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>

          <div
            className={`flex items-center rounded-md border overflow-hidden focus:outline-none focus-within:ring-2 ${
              errors.phoneNumber
                ? "border-red-500 focus-within:ring-red-500"
                : "border-gray-300 focus-within:ring-blue-500"
            }`}
          >
            <span className="px-3 py-2.5 bg-gray-100 text-sm text-gray-700 whitespace-nowrap">
              🇮🇳 +91
            </span>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              maxLength={10}
              placeholder="10-digit number"
              value={formData.phoneNumber}
              onChange={handleChange("phoneNumber")}
              className="w-full px-3 py-2 text-sm outline-none"
              required
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange("address")}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.address
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange("city")}
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.city
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="postcode"
            className="text-sm font-medium text-gray-700"
          >
            Pincode
          </label>
          <input
            type="text"
            name="postcode"
            maxLength={6}
            value={formData.postcode}
            onChange={handleChange("postcode")}
            placeholder="Pincode"
            className={`w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 ${
              errors.postcode
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.postcode && (
            <p className="text-sm text-red-500 mt-1">{errors.postcode}</p>
          )}
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="landmark"
            className="text-sm font-medium text-gray-700"
          >
            Near Landmark
          </label>
          <input
            id="landmark"
            name="landmark"
            placeholder="Landmark"
            value={formData.landmark}
            onChange={handleChange("landmark")}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default PersonalInfoStep;
