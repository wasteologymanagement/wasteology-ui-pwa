import React from "react";
import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import joinUsImage from "../../../assets/join-us.png";

const CtaPage = () => {
  return (
    <div className="bg-gradient-to-b from-white to-green-50 py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={joinUsImage}
            alt="Join Us"
            className="w-64 md:w-96 object-contain"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-4 leading-tight">
            Join Us in Building a{" "}
            <span className="text-green-600">Cleaner India</span>
          </h2>

          <p className="text-gray-600 mb-8 text-base md:text-lg leading-relaxed">
            Whether you're a partner, a volunteer, or an innovator — let’s work
            together toward a sustainable future.
          </p>

          <Button
            href="/contact"
            variant="contained"
            size="large"
            className="!bg-green-700 hover:!bg-green-800 text-white rounded-full px-6 py-3 shadow-md normal-case text-sm md:text-base flex items-center gap-2"
          >
            Contact Us
            <ArrowForwardIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CtaPage;
