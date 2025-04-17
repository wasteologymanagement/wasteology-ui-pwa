import React from "react";
import { Box, Container } from "@mui/material";

const ServiceHeroSection = () => {
  return (
    <Box className="bg-gradient-to-b from-green-100 via-green-50 to-white py-16 px-4 md:px-10">
      <Container maxWidth="lg" className="text-center px-4">
        <h1 className="text-green-800 font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-3">
          Our <span className="text-green-600">Services</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We provide doorstep scrap collection and eco-conscious recycling for
          households. Corporate services launching soon.
        </p>
      </Container>
    </Box>
  );
};

export default ServiceHeroSection;
