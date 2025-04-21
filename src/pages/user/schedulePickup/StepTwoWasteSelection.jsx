import React, { useEffect, useState } from "react";
import { fetchScrapTypes } from "../../../service/apiServices/scrapTypeService";

const StepTwoWasteSelection = ({ data, setData, onNext, onBack }) => {
  const [wasteTypes, setWasteTypes] = useState([]);
  const [loading, setLoading] = useState(true); // loader state

  useEffect(() => {
    const loadScrapTypes = async () => {
      try {
        const types = await fetchScrapTypes();
        setWasteTypes(types);
      } catch (error) {
        console.error("Failed to load scrap types:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScrapTypes();
  }, []);

  const handleQuantityChange = (wasteId, action) => {
    const updatedQuantities = { ...data.wasteQuantities };
    if (action === "increment") {
      updatedQuantities[wasteId] = (updatedQuantities[wasteId] || 0) + 1;
    } else if (action === "decrement" && updatedQuantities[wasteId] > 0) {
      updatedQuantities[wasteId] -= 1;
    }
    setData({ ...data, wasteQuantities: updatedQuantities });
  };

  const handleWasteChange = (wasteId, isChecked) => {
    const updatedWasteTypes = isChecked
      ? [...data.selectedWasteTypes, wasteId]
      : data.selectedWasteTypes.filter((id) => id !== wasteId);

    const updatedQuantities = { ...data.wasteQuantities };

    if (!isChecked) {
      updatedQuantities[wasteId] = 0; // Reset quantity if unchecked
    }

    setData({
      ...data,
      selectedWasteTypes: updatedWasteTypes,
      wasteQuantities: updatedQuantities,
    });
  };

  // 👇 Show loader while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  // Disable "Next" button if no waste types are selected
  const isNextDisabled =
    data.selectedWasteTypes.length === 0 ||
    data.selectedWasteTypes.some(
      (wasteId) =>
        !data.wasteQuantities[wasteId] || data.wasteQuantities[wasteId] < 1
    );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Select Waste Types</h3>

      <div className="space-y-2">
        {wasteTypes.map((waste) => (
          <div key={waste.value} className="flex items-center justify-between">
            <label className="text-md text-gray-700 flex items-center">
              {/* Custom styled checkbox */}
              <input
                type="checkbox"
                checked={data.selectedWasteTypes.includes(waste.value)}
                onChange={(e) =>
                  handleWasteChange(waste.value, e.target.checked)
                }
                className="mr-2 peer h-4 w-4 border-gray-300 rounded-md focus:ring-0 checked:bg-green-600" // Tailwind custom styling
              />
              {waste.label}
            </label>

            {data.selectedWasteTypes.includes(waste.value) && (
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(waste.value, "decrement")}
                  className="px-2 py-1 text-xs bg-gray-200 rounded-full mr-2"
                >
                  -
                </button>
                <span className="px-2">
                  {data.wasteQuantities[waste.value] || 0}
                </span>
                <button
                  onClick={() => handleQuantityChange(waste.value, "increment")}
                  className="px-2 py-1 text-xs bg-gray-200 rounded-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded-xl text-sm text-gray-700"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className={`px-4 py-2 rounded-xl text-sm ${
            isNextDisabled
              ? "bg-gray-300 text-gray-700"
              : "bg-green-600 text-white"
          }`}
          disabled={isNextDisabled} // Disable the "Next" button
        >
          Next
        </button>
      </div>
      {/* 🟡 Note for user */}
      <p className="text-sm text-yellow-600 mt-2">
        ⚠️ Please note: For each selected waste type, you must choose a quantity
        greater than 0.
      </p>
    </div>
  );
};

export default StepTwoWasteSelection;
