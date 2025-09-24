import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveTrashMaterialsThunk } from "../../../store/slice/trashMaterialSlice";
import { Box, CircularProgress } from "@mui/material";

const StepTwoWasteSelection = ({ data, setData, onNext, onBack }) => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.trashMaterial);

  useEffect(() => {
    if (!list || list.length === 0) {
      dispatch(fetchActiveTrashMaterialsThunk());
    }
  }, [dispatch, list]);

  // Update both wasteQuantities and items for payload
  const handleQuantityChange = (material, action) => {
    const updatedQuantities = { ...data.wasteQuantities };
    const currentQty = updatedQuantities[material.id]?.quantity || 0;

    let newQty = currentQty;
    if (action === "increment") newQty = currentQty + 1;
    else if (action === "decrement" && currentQty > 0) newQty = currentQty - 1;

    if (newQty === 0) delete updatedQuantities[material.id];
    else updatedQuantities[material.id] = { ...material, quantity: newQty };

    // Update items array for payload
    const updatedItems = Object.entries(updatedQuantities).map(([id, item], index) => ({
      itemId: index + 1,
      type: item.displayName,
      displayName: item.displayName,
      quantity: item.quantity,
      unit: item.unit,
    }));

    setData({
      ...data,
      wasteQuantities: updatedQuantities,
      items: updatedItems,
    });
  };

  const handleNext = () => {
    if (data.items.length === 0) {
      alert("Please select at least one waste material.");
      return;
    }
    onNext();
  };

  if (status === "loading" && !list.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
        <CircularProgress />
      </Box>
    );
  }

  // Group materials by type
  const grouped = list?.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6 px-4 sm:px-6">
      <h3 className="text-xl font-bold text-gray-800 text-center">
        Select Waste Materials
      </h3>

      {status !== "loading" &&
        grouped &&
        Object.entries(grouped).map(([type, materials]) => (
          <div key={type} className="space-y-2">
            <h4 className="text-md font-semibold text-green-700 mb-1">{type}</h4>
            <div className="flex overflow-x-auto space-x-4 py-2">
              {materials.map((material) => {
                const qty = data.wasteQuantities[material.id]?.quantity || 0;
                return (
                  <div
                    key={material.id}
                    className="flex-shrink-0 w-32 p-3 bg-white border rounded-xl shadow-sm hover:shadow-md flex flex-col items-center transition"
                  >
                    {material.imageUrl && (
                      <img
                        src={material.imageUrl}
                        alt={material.displayName}
                        className="w-12 h-12 object-contain mb-2"
                      />
                    )}
                    <span className="text-sm font-medium text-center mb-1">
                      {material.displayName}
                    </span>
                    <span className="text-xs text-gray-400 mb-2">{material.unit}</span>

                    <div className="flex items-center justify-center space-x-2 mt-1">
                      <button
                        onClick={() => handleQuantityChange(material, "decrement")}
                        className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition text-sm"
                      >
                        -
                      </button>
                      <span className="px-2 text-sm font-medium">{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(material, "increment")}
                        className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300 transition text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition text-sm"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepTwoWasteSelection;
