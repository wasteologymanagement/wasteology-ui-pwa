import React, { useState } from "react";
import StepOnePickupDetails from "./StepOnePickupDetails";
import StepTwoWasteSelection from "./StepTwoWasteSelection";
import StepThreeReviewAndSubmit from "./StepThreeReviewAndSubmit";
import { useSelector } from "react-redux";
import { trashRequestApi } from "../../../service/apiServices/pickupRequestService";
import { formatToYMDWithSlashes } from "../../../utils/dateFormatter";
import TrashrequestSubmitSuccessPopUp from "../../../components/TrashrequestSubmitSuccessPopUp";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../../store/slice/userSlice";

const SchedulePickupForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // get logged-in userId from auth slice
  const authState = useSelector((state) => state.auth);
  const userId = authState?.userId;

  // get user slice state
  const userDetails = useSelector(selectUser);

  const [data, setData] = useState({
    userId: userId || 0,
    addressId: 0,
    pickupDate: "",
    pickupTime: "",
    mobileNumber: userDetails?.mobileNumber || "",
    approxWeight: 0,   // corresponds to estimatedWeight
    items: [],         // array of selected waste items
    firstName: userDetails?.firstName || "",
    lastName: userDetails?.lastName || "",
    email: userDetails?.email || "",

    // For UI convenience
    selectedWasteTypes: [], // e.g., ["Plastic", "Glass"]
    wasteQuantities: {},    // e.g., { Plastic: 2, Glass: 3 }
  });



  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handleBackStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    console.log("hereeeeeeeeeeee")
    const requestPayload = {
      userId: data.userId,
      addressId: parseInt(data.addressId),
      pickupDate: formatToYMDWithSlashes(data.pickupDate),
      pickupTime: data.pickupTime,
      mobileNumber: data.phoneNumber,
      approxWeight: parseFloat(data.estimatedWeight || 0),
      items: Object.entries(data.wasteQuantities).map(([wasteType, quantity], index) => ({
        itemId: index + 1,
        type: wasteType,
        displayName: wasteType, // could be a prettier label if you want
        quantity: quantity,
        unit: "KG",
      })),
    };

    try {
      await trashRequestApi(requestPayload);
      setShowSuccess(true);
      setCurrentStep(1);
    } catch (error) {
      console.error("Submission error:", error);
      // Optionally show error toast/snackbar
    }
  };

  return (
    <>
      {!showSuccess ? (
        <div className="min-h-[180] flex justify-center items-center px-1 py-8">
          <div className="w-full max-w-md md:max-w-3xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-10 transition-all duration-300">
            <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
              Schedule a Pickup
            </h2>

            {currentStep === 1 && (
              <StepOnePickupDetails
                data={data}
                setData={setData}
                onNext={handleNextStep}
              />
            )}
            {currentStep === 2 && (
              <StepTwoWasteSelection
                data={data}
                setData={setData}
                onNext={handleNextStep}
                onBack={handleBackStep}
              />
            )}
            {currentStep === 3 && (
              <StepThreeReviewAndSubmit
                data={data}
                onSubmit={handleSubmit}
                onBack={handleBackStep}
              />
            )}
          </div>
        </div>
      ) : (
        <TrashrequestSubmitSuccessPopUp startTimer={true} from="app" />
      )}
    </>
  );
};

export default SchedulePickupForm;
