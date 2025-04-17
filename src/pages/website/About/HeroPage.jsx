import React from "react";
import { Typography, Box } from "@mui/material";
import recyclingTruckPickingImage from "../../../assets/ChatGPT_Image_2.png";

const HeroPage = () => {
  return (
    <Box className="bg-gradient-to-b from-green-100 to-white py-16 px-4 md:px-10">
      <Box className="max-w-screen-xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <Box className="w-full lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-green-800 tracking-tight mb-4">
            About <span className="text-[#F7D54D]">Wasteology</span>
          </h2>

          <Typography className="text-gray-700 text-base sm:text-lg mt-4 leading-relaxed">
            At Wasteology, we’re redefining how waste is handled — one pickup at a time. 
            We simplify the process of turning everyday waste into valuable resources by 
            connecting people with reliable, responsible recyclers.
          </Typography>

          <Typography className="text-gray-700 text-base sm:text-lg mt-4 leading-relaxed">
            Whether you’re decluttering your home, upgrading appliances, or managing 
            scrap from a small business — we’re here to help make sustainability easy, accessible, 
            and impactful.
          </Typography>

          <Typography className="text-gray-700 text-base sm:text-lg mt-4 leading-relaxed">
            Built with a community-first mindset, our goal is to make waste management 
            smarter and cleaner for everyone. As we grow, so does our commitment to a more 
            sustainable future.
          </Typography>
        </Box>

        {/* Image */}
        <Box className="w-full lg:w-1/2 flex justify-center">
          <img
            src={recyclingTruckPickingImage}
            alt="Recycling Illustration"
            className="w-[95%] sm:w-[90%] md:w-[100%] lg:w-[120%] max-w-none h-auto"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HeroPage;
