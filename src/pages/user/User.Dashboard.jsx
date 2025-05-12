import React, { useState } from "react";
import {
  MdCalendarToday,
  MdRecycling,
  MdOutlineStar,
  MdCheckCircle,
  MdNotificationsActive,
  MdAttachMoney,
  MdModeNight,
  MdBrightness7,
  MdPerson,
  MdLocalShipping,
  MdScale,
} from "react-icons/md";
import {
  FiPlusCircle,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiTrendingUp,
  FiRefreshCcw,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

const mockPickups = [
  {
    id: 1,
    date: "Apr 22, 2025",
    time: "10:00 AM - 12:00 PM",
    address: "123 Green Street, Delhi",
    type: "E-waste, Plastic",
    status: "Scheduled",
  },
  {
    id: 2,
    date: "Apr 25, 2025",
    time: "2:00 PM - 4:00 PM",
    address: "456 Eco Avenue, Gurugram",
    type: "Paper, Metal",
    status: "Scheduled",
  },
];

const ecoTips = [
  "♻️ Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
  "🌱 Composting reduces landfill waste and enriches soil.",
  "🚴‍♂️ Use a bike or walk for short trips to reduce carbon footprint.",
  "📦 Flatten cardboard boxes before recycling to save space.",
];

const UserDashboardPage = () => {
  const tip = ecoTips[Math.floor(Math.random() * ecoTips.length)];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen p-6 md:p-10 transition-all">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome Back, Ankit
        </h1>
        <p className="text-gray-500 text-sm">
          Let’s manage your scrap in a greener way 🌿
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Got Scrap at Home?
          </h2>
          <p className="text-sm text-green-100">
            Schedule a pickup now and help the planet 🌍
          </p>
        </div>
        <button className="mt-4 sm:mt-0 inline-flex items-center bg-white text-green-600 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition">
          <FiPlusCircle className="mr-2" />
          Schedule Pickup
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 hover:shadow-xl transition-all">
          <div className="bg-green-100 p-3 sm:p-4 rounded-full">
            <MdRecycling className="text-green-600 text-2xl sm:text-3xl" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              15 Pickups
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Completed pickups
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 hover:shadow-xl transition-all">
          <div className="bg-blue-100 p-3 sm:p-4 rounded-full">
            <MdCalendarToday className="text-blue-600 text-2xl sm:text-3xl" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              2 Upcoming
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Scheduled pickups
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 hover:shadow-xl transition-all">
          <div className="bg-yellow-100 p-3 sm:p-4 rounded-full">
            <MdAttachMoney className="text-yellow-600 text-2xl sm:text-3xl" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              ₹2,350
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Earned this month
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 hover:shadow-xl transition-all">
          <div className="bg-orange-100 p-3 sm:p-4 rounded-full">
            <MdScale className="text-orange-600 text-2xl sm:text-3xl" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
              350 kg
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Recycled weight</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upcoming Pickups
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockPickups.map((pickup) => (
            <div
              key={pickup.id}
              className="bg-white rounded-2xl shadow-md p-5 transition hover:shadow-lg border border-gray-100"
            >
              <div className="flex items-center text-sm text-green-600 mb-2">
                <FiCalendar className="mr-2" />
                {pickup.date}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FiClock className="mr-2" />
                {pickup.time}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FiMapPin className="mr-2" />
                {pickup.address}
              </div>
              <p className="text-sm text-gray-700 font-medium">
                Trash Type: <span className="font-semibold">{pickup.type}</span>
              </p>
              <div className="mt-3 inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                {pickup.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eco Tip Card */}
      <div className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4 border-l-4 border-green-500">
        <div className="text-green-600 mt-1">
          <FiInfo size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{tip}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;

// import React from "react";
// import {
//   FiPlusCircle,
//   FiCalendar,
//   FiClock,
//   FiMapPin,
//   FiUser,
//   FiTrendingUp,
//   FiRefreshCcw,
//   FiCheckCircle,
//   FiInfo,
// } from "react-icons/fi";

// const mockPickups = [
//   {
//     id: 1,
//     date: "Apr 22, 2025",
//     time: "10:00 AM - 12:00 PM",
//     address: "123 Green Street, Delhi",
//     type: "E-waste, Plastic",
//     status: "Scheduled",
//   },
//   {
//     id: 2,
//     date: "Apr 25, 2025",
//     time: "2:00 PM - 4:00 PM",
//     address: "456 Eco Avenue, Gurugram",
//     type: "Paper, Metal",
//     status: "Scheduled",
//   },
// ];

// const ecoTips = [
//   "♻️ Recycling one aluminum can saves enough energy to run a TV for 3 hours.",
//   "🌱 Composting reduces landfill waste and enriches soil.",
//   "🚴‍♂️ Use a bike or walk for short trips to reduce carbon footprint.",
//   "📦 Flatten cardboard boxes before recycling to save space.",
// ];

// const UserDashboardPage = () => {
//   const tip = ecoTips[Math.floor(Math.random() * ecoTips.length)];

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">

//       {/* Eco Tip Card */}
//       <div className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4 border-l-4 border-green-500">
//         <div className="text-green-600 mt-1">
//           <FiInfo size={24} />
//         </div>
//         <div>
//           <p className="text-sm text-gray-600">{tip}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboardPage;
