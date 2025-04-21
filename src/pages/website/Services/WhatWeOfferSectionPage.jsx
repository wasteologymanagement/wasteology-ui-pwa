import React from "react";
import {
  CalendarMonth,
  LocalShipping,
  MonetizationOn,
  Recycling,
} from "@mui/icons-material";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";

const WhatWeOfferSection = () => {
  const features = [
    {
      icon: <LocalShipping fontSize="medium" className="text-white" />,
      title: "Doorstep Pickup",
      desc: "We come to you—no hassle, no stress.",
      bg: "bg-emerald-500",
    },
    {
      icon: <CalendarMonth fontSize="medium" className="text-white" />,
      title: "Flexible Scheduling",
      desc: "Book pickups at your preferred time.",
      bg: "bg-sky-500",
    },
    {
      icon: <MonetizationOn fontSize="medium" className="text-white" />,
      title: "Transparent Pricing",
      desc: "Get fair value based on weight & type.",
      bg: "bg-amber-500",
    },
    {
      icon: <Recycling fontSize="medium" className="text-white" />,
      title: "Eco-Conscious Recycling",
      desc: "Your waste goes to certified recyclers.",
      bg: "bg-lime-500",
    },
  ];

  return (
    <Box className="bg-gradient-to-b py-10 px-4 sm:px-6 lg:px-8">
      <Container maxWidth="lg">
        <h2 className="text-4xl font-extrabold text-center text-green-800 mb-10">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon, title, desc, bg }, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`${bg} p-4 rounded-full mb-4 shadow-md flex items-center justify-center`}
              >
                {icon}
              </div>
              <h3 className="text-green-900 font-semibold text-lg sm:text-xl">
                {title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default WhatWeOfferSection;
