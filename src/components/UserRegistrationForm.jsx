import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../store/slice/registrationSlice";
import {
  fetchUserByPhoneNumber,
  loginSuccess,
} from "../store/slice/userSlice";

const initialForm = {
  firstName: "",
  lastName: "",
  address: "",
  phoneNumber: "",
  emailId: "",
  city: "",
  postcode: "",
};

const UserRegistrationForm = () => {
  const [formData, setFormData] = useState(initialForm);
  const [pincode, setPincode] = useState("");
  const [pinCheckMsg, setPinCheckMsg] = useState("");
  const [isServiceable, setIsServiceable] = useState(true);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: phone,
    }));
  }, [phone]);

  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length === 6) {
        setIsCheckingPin(true);
        const response = await fakeCheckPincodeAPI(pincode);
        if (response.available) {
          setIsServiceable(true);
          setPinCheckMsg("✅ Service available in your area.");
        } else {
          setIsServiceable(false);
          setPinCheckMsg("❌ Sorry, service is not available at this pincode.");
        }
        setIsCheckingPin(false);
      } else {
        setPinCheckMsg("");
        setIsServiceable(true);
        setIsCheckingPin(false);
      }
    };

    checkPincode();
  }, [pincode]);

  const fakeCheckPincodeAPI = async (pin) => {
    await new Promise((res) => setTimeout(res, 1000));
    const available = /^11|12/.test(pin); // Only '11xxx' and '12xxx' are serviceable
    return { available };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      phoneNumber: `+91${phone}`,
      postcode: pincode,
    };

    setIsLoading(true);

    try {
      const response = await dispatch(registerUser(finalData)).unwrap();

      if (response) {
        setTimeout(async () => {
          try {
            const userDetails = await dispatch(
              fetchUserByPhoneNumber(finalData.phoneNumber.replace("+91", ""))
            ).unwrap();

            if (userDetails?.status === 417) {
              setIsAlreadyRegistered(true);
              setTimeout(() => {
                navigate("/app/user/schedule");
              }, 3000);
            } else {
              dispatch(loginSuccess(userDetails));
              setIsSuccess(true);
              setTimeout(() => {
                navigate("/app/user/schedule");
              }, 5000);
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 md:px-8">
      {isAlreadyRegistered ? (
        <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Already Registered
          </h2>
          <p className="text-yellow-600">Redirecting to your dashboard...</p>
        </div>
      ) : isSuccess ? (
        <div className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Registration Successful!
          </h2>
          <p className="text-center text-green-600">
            You will be redirected shortly...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Register for Scrap Pickup
          </h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 border px-3 py-2 rounded-lg text-sm"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 border px-3 py-2 rounded-lg text-sm"
            />
          </div>

          <input
            name="emailId"
            type="email"
            placeholder="Email"
            value={formData.emailId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg text-sm"
          />

          <div className="w-full flex border rounded-lg overflow-hidden">
            <span className="px-3 py-2 bg-gray-100 text-sm flex items-center select-none">
              🇮🇳 +91
            </span>
            <input
              name="phoneNumber"
              type="tel"
              maxLength={10}
              placeholder="Enter 10-digit number"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              required
              className="flex-1 px-3 py-2 text-sm outline-none"
            />
          </div>

          <textarea
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg text-sm resize-none"
            rows={3}
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full sm:w-1/2 border px-3 py-2 rounded-lg text-sm bg-white"
            >
              <option value="">Select City</option>
              <option value="Delhi">Delhi</option>
              <option value="Gurgaon">Gurgaon</option>
            </select>

            <div className="relative w-full sm:w-1/2">
              <input
                type="text"
                name="postcode"
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="Pincode"
                required
                className="w-full border px-3 py-2 rounded-lg text-sm pr-10"
              />
              {isCheckingPin && (
                <div className="absolute right-3 top-2.5">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {pinCheckMsg && (
            <p
              className={`text-sm -mt-2 ${
                isServiceable ? "text-green-600" : "text-red-600"
              }`}
            >
              {pinCheckMsg}
            </p>
          )}

          <button
            type="submit"
            className="bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default UserRegistrationForm;
