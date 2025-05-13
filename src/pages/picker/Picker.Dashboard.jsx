import React from "react";
import {
  FaCalendarCheck,
  FaRecycle,
  FaBullhorn,
  FaLeaf,
  FaQuestionCircle,
} from "react-icons/fa";
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
import { FaTruck, FaDollarSign, FaMapMarkerAlt } from "react-icons/fa";
import { MdFeedback, MdPeople } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { RiInformationFill } from "react-icons/ri";

const ClientDashboard = () => {
  return (
    <div className="bg-gray-50 text-gray-800 p-6 md:p-10 transition-all mb-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Welcome Back, Ankit
        </h1>
        <p className="text-gray-500 text-sm">
          Let's manage your scrap pickups efficiently 🌿
        </p>
      </div>

      <div className="bg-green-100 p-4 rounded-xl mb-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="bg-green-500 text-white p-2 rounded-lg mr-4">📅</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Today's Pickup Schedule
            </h2>
            <p className="text-gray-600 text-sm">
              You have 3 pickups scheduled for today.
            </p>
          </div>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
          View Details
        </button>
      </div>

      {/* Dashboard Cards for Pickups, Earnings, and Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-green-600 flex items-center">
            <FaCalendarCheck className="mr-3" />
            Upcoming Pickups
          </h3>
          <p className="text-gray-700 mt-4">
            Next pickup scheduled for: <strong>May 15, 2025, 10:00 AM</strong>
          </p>
          <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-300">
            View Details
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-2xl font-semibold text-green-600 flex items-center">
            <FaTruck className="mr-3" />
            Completed Pickups
          </h3>
          <p className="text-gray-700 mt-4">
            120 pickups completed this month. Keep up the good work!
          </p>
          <button className="mt-6 bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
            View History
          </button>
        </div>
      </div>

      {/* Scrap Collection Section */}
      {/* <div className="bg-white p-6 mt-12 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-2xl font-semibold text-green-600 flex items-center">
          <FaMapMarkerAlt className="mr-3" />
          Total Scrap Collected
        </h3>
        <div className="mt-4">
          <p className="text-gray-700">Total Weight of Scrap Collected:</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">1500 kg</p>
          <p className="text-gray-700 mt-2">
            You've made a significant impact on recycling! 🌍
          </p>
        </div>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300">
          View Scrap Collection
        </button>
      </div> */}

      {/* Feedback Section */}
      {/* <div className="bg-white p-6 mt-12 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-2xl font-semibold text-green-600 flex items-center">
          <MdFeedback className="mr-3" />
          Feedback & Ratings
        </h3>
        <p className="text-gray-700 mt-4">
          Your current rating: <strong>4.8/5</strong>
        </p>
        <p className="text-gray-700 mt-2">
          Leave feedback or see client ratings for completed pickups.
        </p>
        <button className="mt-6 bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors duration-300">
          View Feedback
        </button>
      </div> */}

      {/* Support Section */}
      {/* <div className="bg-white p-6 mt-12 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-2xl font-semibold text-green-600 flex items-center">
          <MdPeople className="mr-3" />
          Support & Help
        </h3>
        <p className="text-gray-700 mt-4">
          Need assistance? Contact support for quick help on issues related to
          pickups or vehicle health.
        </p>
        <button className="mt-6 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors duration-300">
          Contact Support
        </button>
      </div> */}
    </div>
  );
};

export default ClientDashboard;
