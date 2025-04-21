import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TrashrequestSubmitSuccessPopUp = ({ startTimer = true, from }) => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  // Countdown logic
  useEffect(() => {
    let interval;

    if (startTimer) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTimer]);

  // Navigate after countdown hits 0
  useEffect(() => {
    if (countdown === 0 && startTimer) {
      const timeout = setTimeout(() => {
        navigate("/app/user/bookings");
      }, 300); // tiny delay to avoid conflict

      return () => clearTimeout(timeout);
    }
  }, [countdown, startTimer, navigate]);

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-yellow-50 border border-green-200 rounded-3xl shadow-lg text-center transition-all duration-300">
      <div className="flex justify-center mb-6">
        <div className="bg-green-100 p-4 rounded-full">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-green-700 mb-3">Thank You!</h2>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-1">
        Your request has been successfully submitted.
      </p>
      <p className="text-gray-600 text-sm sm:text-base mb-6">
        Our team will get in touch with you shortly.
      </p>
      <button
        onClick={() => from === 'app' ? navigate("/app/user/bookings") : navigate('/')}
        className="mt-2 px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-full transition"
      >
        Back to Home
      </button>
      <p className="text-xs text-gray-400 mt-2">
        (Redirecting automatically in{" "}
        <span className="font-semibold text-green-600">{countdown}</span>{" "}
        seconds...)
      </p>
    </div>
  );
};

export default TrashrequestSubmitSuccessPopUp;
