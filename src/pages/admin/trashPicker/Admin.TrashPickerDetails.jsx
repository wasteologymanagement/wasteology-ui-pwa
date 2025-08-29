// src/pages/AdminTrashPickerDetails.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTrashPickerByIdThunk } from "../../../store/slice/trashPickersSlice";
import {
  FiMail,
  FiPhone,
  FiTruck,
  FiUser,
  FiArrowLeft,
  FiMapPin,
  FiBarChart2,
} from "react-icons/fi";
import { Card, CardContent } from "@mui/material";

const AdminTrashPickerDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pickerId } = useParams();

  const { selected, loading } = useSelector((state) => state.trashPickers);

  useEffect(() => {
    if (pickerId) dispatch(fetchTrashPickerByIdThunk(pickerId));
  }, [pickerId, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <p className="text-gray-600 animate-pulse text-lg font-medium">
          Loading details...
        </p>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">No Trash Picker found</p>
      </div>
    );
  }

  // 📊 Stats
  const totalVehicles = selected.vehicles?.length || 0;
  const totalCapacity =
    selected.vehicles?.reduce((sum, v) => sum + (v.capacity || 0), 0) || 0;
  const totalAreas = selected.areaCovered?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Bar with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-100 transition"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Trash Picker Profile
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Detailed information about the picker
          </p>
        </div>

        {/* Profile Card */}
        <Card className="rounded-3xl shadow-lg hover:shadow-xl bg-white/90 backdrop-blur-sm transition">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Circle */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {selected.firstName[0]}
                {selected.lastName[0]}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                  <FiUser className="text-green-500" /> {selected.firstName}{" "}
                  {selected.lastName}
                </h2>
                <p className="flex items-center gap-2 text-gray-600">
                  <FiMail className="text-blue-500" /> {selected.email}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <FiPhone className="text-orange-500" /> {selected.mobileNumber}
                </p>
                <span
                  className={`inline-block px-4 py-1 rounded-full text-sm font-medium shadow-sm ${
                    selected.active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 📊 Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-3xl shadow-md hover:shadow-lg bg-white/90 backdrop-blur-sm transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FiTruck className="text-green-500 text-3xl mb-2" />
              <h4 className="text-lg font-semibold text-gray-800">Vehicles</h4>
              <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md hover:shadow-lg bg-white/90 backdrop-blur-sm transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FiBarChart2 className="text-indigo-500 text-3xl mb-2" />
              <h4 className="text-lg font-semibold text-gray-800">Capacity</h4>
              <p className="text-2xl font-bold text-gray-900">
                {totalCapacity} kg
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-md hover:shadow-lg bg-white/90 backdrop-blur-sm transition">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FiMapPin className="text-orange-500 text-3xl mb-2" />
              <h4 className="text-lg font-semibold text-gray-800">Areas</h4>
              <p className="text-2xl font-bold text-gray-900">{totalAreas}</p>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles */}
        {selected.vehicles && selected.vehicles.length > 0 && (
          <Card className="rounded-3xl shadow-lg hover:shadow-xl bg-white/90 backdrop-blur-sm transition">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                Assigned Vehicles
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {selected.vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-5 border rounded-2xl shadow-sm hover:shadow-md bg-gradient-to-br from-gray-50 to-white transition"
                  >
                    <p className="font-medium flex items-center gap-2 text-gray-800">
                      <FiTruck className="text-indigo-500" />
                      {vehicle.vehicleNumber} ({vehicle.type})
                    </p>
                    <p className="text-sm text-gray-600">
                      Capacity:{" "}
                      <span className="font-semibold">
                        {vehicle.capacity} kg
                      </span>
                    </p>
                    <span
                      className={`mt-3 inline-block px-4 py-1 rounded-full text-xs font-medium shadow-sm ${
                        vehicle.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vehicle.available ? "Available" : "Not Available"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Areas */}
        <Card className="rounded-3xl shadow-lg hover:shadow-xl bg-white/90 backdrop-blur-sm transition">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
              Area Covered
            </h3>
            {selected.areaCovered && selected.areaCovered.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {selected.areaCovered.map((area, idx) => (
                  <li key={idx} className="hover:text-green-600 transition">
                    {area}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 italic">No areas assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTrashPickerDetails;
