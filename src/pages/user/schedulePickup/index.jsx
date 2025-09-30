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
    // console.log("hereeeeeeeeeeee")
    // console.log("data....:", data)
    const requestPayload = {
      userId: data.userId,
      addressId: parseInt(data.addressId),
      pickupDate: data.pickupDate,
      pickupTime: to24HourFormat(data.pickupTime),
      mobileNumber: data.mobileNumber,
      approxWeight: parseFloat(data.estimatedWeight || 0),
      items: Object.entries(data.wasteQuantities).map(([_, obj], index) => ({
        itemId: obj.id ?? index,       // use id if present, else fallback to index
        type: obj.type,
        displayName: obj.displayName,
        quantity: obj.quantity,
        unit: obj.unit || "KG",        // fallback to KG if unit is missing
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

  // 12-hour AM/PM -> 24-hour HH:mm:ss
  function to24HourFormat(timeStr) {
    if (!timeStr) return "N/A";

    const [time, modifier] = timeStr.split(" "); // ["11:30", "AM"]
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  }

  // 24-hour HH:mm:ss -> 12-hour hh:mm AM/PM
  function to12HourFormat(timeStr) {
    if (!timeStr) return "N/A";

    const [hoursStr, minutesStr] = timeStr.split(":");
    let hours = Number(hoursStr);
    const minutes = minutesStr;
    const modifier = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // convert 0 -> 12 for midnight, 13->1, etc.

    return `${String(hours).padStart(2, "0")}:${minutes} ${modifier}`;
  }


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
}


export default SchedulePickupForm;
