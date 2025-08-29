import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCcw,
} from "react-icons/fi";
import { MdRecycling } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTrashMaterialsThunk,
} from "../../store/slice/trashMaterialSlice";
import { useSnackbar } from "../../components/SnackbarProvider";
import { useNavigate } from "react-router-dom";


const ScrapRatesPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterRecyclable, setFilterRecyclable] = useState("all"); // all, recyclable, not
  const [filterActive, setFilterActive] = useState("all"); // all, active, inactive
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { showMessage } = useSnackbar();
  const { list, status, error, message } = useSelector(
    (state) => state.trashMaterial
  );

  const fetchScrapRates = async () => {
    setLoading(true);
    await dispatch(fetchTrashMaterialsThunk());
    setLoading(false);
  };

  useEffect(() => {
    fetchScrapRates();
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed" && error) showMessage(error, "error");
    if (message) showMessage(message, "success");
  }, [status, error, message, showMessage]);

  // Filter + Search logic
  const filteredList = useMemo(() => {
    return list
      .filter((item) => {
        // Search
        const searchLower = searchText.toLowerCase();
        const matchesSearch =
          item.displayName.toLowerCase().includes(searchLower) ||
          (item.description || "").toLowerCase().includes(searchLower);

        // Recyclable filter
        const matchesRecyclable =
          filterRecyclable === "all"
            ? true
            : filterRecyclable === "recyclable"
              ? item.recyclable
              : !item.recyclable;

        // Active filter
        const matchesActive =
          filterActive === "all"
            ? true
            : filterActive === "active"
              ? item.active
              : !item.active;

        return matchesSearch && matchesRecyclable && matchesActive;
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [list, searchText, filterRecyclable, filterActive]);

  // Group by type
  const groupedByType = useMemo(() => {
    const map = {};
    filteredList.forEach((item) => {
      if (!map[item.type]) map[item.type] = [];
      map[item.type].push(item);
    });
    return map;
  }, [filteredList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-12 flex flex-col">
      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
          ♻️ Scrap Rates
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Updated scrap rates — trade your waste & earn today
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search scrap..."
          className="px-3 py-2 rounded-lg border border-gray-300 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={filterRecyclable}
          onChange={(e) => setFilterRecyclable(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All</option>
          <option value="recyclable">Recyclable</option>
          <option value="not">Not Recyclable</option>
        </select>

        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Status</option>
          <option value="active">Available</option>
          <option value="inactive">Not Available</option>
        </select>

        <button
          onClick={fetchScrapRates}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition disabled:opacity-50"
        >
          <FiRefreshCcw className="w-4 h-4" />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Important Notes */}
      <div className="mt-8 mb-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 border-dashed border-3 rounded-lg text-sm text-gray-700 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-semibold text-green-800 mb-1">
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 112 0v4a1 1 0 11-2 0V6zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              clipRule="evenodd"
            />
          </svg>
          Important Notes
        </div>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Scrap Rates Change for bulk Quantity. To get a quote, contact us for bulk scrap at{" "}
            <a href="tel:+919289193001" className="text-green-700 font-semibold">
              +91-9289193001
            </a>
          </li>
          <li>
            The price may vary upon pickup of the scrap material, which could differ from what is shown in the image provided.
          </li>
          <li>
            Minimum Scrap Pickup Value Should be:{" "}
            <span className="font-semibold text-green-700">₹250</span>
          </li>
        </ul>
      </div>


      {/* Grid Sectioned by Type */}
      {loading ? (
        <div className="text-center text-gray-500 mt-6">Loading scrap rates...</div>
      ) : Object.keys(groupedByType).length === 0 ? (
        <div className="text-center text-gray-500 mt-6">No scrap rates available</div>
      ) : (
        <div className="flex flex-col gap-8 flex-1">
          {Object.entries(groupedByType).map(([type, items]) => (
            <div key={type}>
              <h2 className="text-xl text-center font-semibold text-gray-800 mb-4 capitalize pb-1">
                {type.replace("_", " ")}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 bg-gray-50 rounded-xl p-6">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className={`bg-white rounded-xl shadow-md p-2 flex flex-col items-center text-center hover:shadow-lg transition relative ${!item.active ? "opacity-60 grayscale" : ""}`}
                  >
                    {/* Image */}
                    <div className="h-28 w-full bg-gray-50 flex items-center justify-center rounded-lg mb-3">
                      <img src={item.imageUrl} alt={item.displayName} className="h-20 object-contain" />
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-semibold text-gray-800 mb-1 truncate">
                      {item.displayName}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mb-2 truncate">
                      {item.description || "No description"}
                    </p>

                    {/* Price */}
                    <span className="text-green-700 font-bold text-lg mb-3">
                      ₹{item.pricePerUnit} <span className="text-sm text-gray-500">per {item.unit}</span>
                    </span>

                    {/* Status Icons */}
                    <div className="flex items-center gap-4 mb-3">
                      {/* Availability */}
                      <div className="relative group">
                        {item.active ? (
                          <FiCheckCircle className="text-green-600 w-6 h-6" />
                        ) : (
                          <FiXCircle className="text-red-600 w-6 h-6" />
                        )}
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition">
                          {item.active ? "Available" : "Not Available"}
                        </span>
                      </div>

                      {/* Recyclable */}
                      <div className="relative group">
                        {item.recyclable ? (
                          <MdRecycling className="text-blue-600 w-6 h-6" />
                        ) : (
                          <FiXCircle className="text-gray-400 w-6 h-6" />
                        )}
                        <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition">
                          {item.recyclable ? "Recyclable" : "Not Recyclable"}
                        </span>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => navigate("/dashboard")} // ⬅️ Navigate to dashboard
                      className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transition"
                    >
                      Book Now
                    </button>
                  </motion.div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} ScrapRate App
      </div>
    </div>
  );
};

export default ScrapRatesPage;
