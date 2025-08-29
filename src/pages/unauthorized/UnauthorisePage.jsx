import React from "react";
import { Lock } from "lucide-react";

const Unauthorise = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-10 w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-5 rounded-full shadow-inner">
            <Lock className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
          Unauthorized Access
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-sm sm:text-base mb-8 leading-relaxed">
          Oops! You don’t have permission to view this page.  
          Please contact support or return to the homepage.
        </p>

        {/* Button */}
        <a
          href="/"
          className="inline-block w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md"
        >
          ⬅ Back to Home
        </a>
      </div>
    </div>
  );
};

export default Unauthorise;
