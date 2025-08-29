import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  MdCalendarToday,
  MdRecycling,
  MdAttachMoney,
  MdScale,
} from "react-icons/md";
import {
  FiPlusCircle,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiInfo,
} from "react-icons/fi";

// Mock Data
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
  const authState = useSelector((state) => state.auth);
  const userName = authState?.name;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 min-h-screen p-6 md:p-10">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome Back, {userName || "User"}
        </h1>
        <p className="text-gray-500 text-sm">
          Let’s manage your scrap in a greener way 🌿
        </p>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10"
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">
            Got Scrap at Home?
          </h2>
          <p className="text-sm text-green-100">
            Schedule a pickup now and help the planet 🌍
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="mt-4 sm:mt-0 inline-flex items-center bg-white text-green-600 px-5 py-2 rounded-full shadow-md hover:shadow-lg transition"
        >
          <FiPlusCircle className="mr-2" />
          Schedule Pickup
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            icon: <MdRecycling className="text-green-600 text-3xl" />,
            title: "15 Pickups",
            desc: "Completed pickups",
            bg: "bg-green-50",
          },
          {
            icon: <MdCalendarToday className="text-blue-600 text-3xl" />,
            title: "2 Upcoming",
            desc: "Scheduled pickups",
            bg: "bg-blue-50",
          },
          {
            icon: <MdAttachMoney className="text-yellow-600 text-3xl" />,
            title: "₹2,350",
            desc: "Earned this month",
            bg: "bg-yellow-50",
          },
          {
            icon: <MdScale className="text-orange-600 text-3xl" />,
            title: "350 kg",
            desc: "Recycled weight",
            bg: "bg-orange-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white shadow-lg rounded-2xl p-6 flex items-center space-x-4 cursor-pointer hover:shadow-2xl transition-all"
          >
            <div className={`${stat.bg} p-4 rounded-full`}>{stat.icon}</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                {stat.title}
              </h2>
              <p className="text-sm text-gray-500">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Pickups */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mb-12"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          Upcoming Pickups
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockPickups.map((pickup, i) => (
            <motion.div
              key={pickup.id}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all"
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
                Trash Type:{" "}
                <span className="font-semibold">{pickup.type}</span>
              </p>
              <div className="mt-3 inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                {pickup.status}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Eco Tip */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-md p-5 flex items-start gap-4 border-l-4 border-green-500"
      >
        <div className="text-green-600 mt-1">
          <FiInfo size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{tip}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboardPage;
