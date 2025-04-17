import React, { useState } from 'react';
import StepOnePickupDetails from './StepOnePickupDetails';
import StepTwoWasteSelection from './StepTwoWasteSelection';
import StepThreeReviewAndSubmit from './StepThreeReviewAndSubmit';
import { useSelector } from 'react-redux';
import { trashRequestApi } from '../../../service/apiServices/pickupRequestService';

const SchedulePickupForm = () => {
  const user = useSelector((state) => state.user.user);
  console.log("user state : ", user)
  const [data, setData] = useState({
    pickupDate: '',
    pickupTime: '',
    addressId: '',
    address: user?.userAddress || [],
    city: '',
    landmark: '',
    selectedWasteTypes: [],
    wasteQuantities: {},
    wasteTypes: [],
    estimatedWeight: '',
    phoneNumber: user?.mobileNumber || '',
    userId: user?.userId || '',
    email: user?.emailId || '', 
    firstName: user?.firstName || '',
    lastName: user?.userId || ''
  });

  
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
   
    const requestPayload = {
      pickupDate: data.pickupDate,
      approxPickupTime: data.pickupTime,
      userId: data.userId,
      userAddressId: parseInt(data.addressId),
      phoneNumber: data.phoneNumber,
      nearLandMark: data.landmark,
      weight: data.estimatedWeight,
      // type: data,
      trashType: data.wasteQuantities,
    };
     // Handle form submission here (API call, etc.)
     console.log('Pickup Request Submitted:', requestPayload);

     const response = await trashRequestApi(requestPayload);

     // Handle successful API response
     console.log('API Response:', response);
    // alert('Pickup request submitted!');
    // setCurrentStep(1); // Reset to Step 1 after submission
  };

  return (
    <div className="min-h-[180] flex justify-center items-center px-1 py-8">
      <div className="w-full max-w-md md:max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-4 md:p-10 transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Schedule a Pickup
        </h2>

        {currentStep === 1 && (
          <StepOnePickupDetails data={data} setData={setData} onNext={handleNextStep} />
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
  );
};

export default SchedulePickupForm;
