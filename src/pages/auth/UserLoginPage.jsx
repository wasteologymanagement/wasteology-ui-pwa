import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userLoginPng from "../../assets/user_login.png";

const UserLoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidMobile = (num) => /^(\+91)?[6-9]\d{9}$/.test(num);

  const handleSendOtp = () => {
    if (!isValidMobile(mobileNumber)) {
      alert("Please enter a valid Indian mobile number");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/app/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <img
            src={userLoginPng}
            alt="Login Vector"
            className="h-32 mx-auto mb-4 sm:h-40 md:h-48"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-gray-500">
            Login using your mobile number
          </p>
        </div>

        {!otpSent ? (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden mb-4">
              <span className="bg-gray-100 text-gray-700 px-3 py-3 text-sm font-semibold">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                placeholder="9876543210"
                value={mobileNumber}
                maxLength={10}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="flex-1 px-3 py-2 outline-none"
              />
            </div>

            <button
              className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-3xl font-semibold"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Enter OTP
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4 outline-none"
            />

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        By continuing, you agree to our <span className="underline">Terms</span>{" "}
        and <span className="underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default UserLoginPage;
