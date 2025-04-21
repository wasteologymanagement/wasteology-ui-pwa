import React from "react";
import {
  HomeRepairService,
  EventAvailable,
  CheckCircle,
} from "@mui/icons-material";
import { Box, Container } from "@mui/material";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: (
        <HomeRepairService
          fontSize="large"
          className="text-white"
        />
      ),
      title: "Choose Waste Type",
      desc: "Tell us what you want to recycle.",
      color: "bg-gradient-to-r from-emerald-500 to-green-600",
    },
    {
      icon: (
        <EventAvailable
          fontSize="large"
          className="text-white"
        />
      ),
      title: "Pick a Time",
      desc: "Select a convenient pickup slot.",
      color: "bg-gradient-to-r from-sky-500 to-blue-600",
    },
    {
      icon: (
        <CheckCircle
          fontSize="large"
          className="text-white"
        />
      ),
      title: "We Pick It Up",
      desc: "Our team reaches your doorstep.",
      color: "bg-gradient-to-r from-yellow-400 to-amber-500",
    },
  ];

  return (
    <Box className="py-5 px-4 bg-white">
      <Container maxWidth="lg">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-green-800 mb-14">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {steps.map(({ icon, title, desc, color }, index) => (
            <Box
              key={index}
              className="bg-green-50 hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6 text-center border-t-4 border-green-600"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 shadow-md ${color}`}
              >
                {icon}
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">{desc}</p>
            </Box>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
