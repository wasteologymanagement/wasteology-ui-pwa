import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import {
  CalendarMonth as CalendarIcon,
  LocalShipping as DeliveryIcon,
  VerifiedUser as VerifiedIcon,
  Recycling as RecyclingIcon,
} from "@mui/icons-material";
import garbageCollectionImage from "../../../assets/waste-garbage-collecti.png";
import QuickScrapPickupFormDialog from "../../../components/QuickScrapPickupFormDialog";
import QuickBookDialog from "../../../components/QuickBook";

const WhyChooseUsPage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  
    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  return (
    <section className="bg-white py-16 px-4 md:px-10">
      <h2 className="text-center font-bold mb-14 text-gray-800 text-3xl md:text-4xl">
      Why Choose Us?
      </h2>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 animate-fade-in">
        {/* Left box: content */}
        <Box className="w-full md:w-1/2">
          <Typography
            variant="body1"
            className="text-gray-700 mb-4 leading-relaxed pb-5 text-center md:text-justify"
          >
            We provide the best value for your scrap through our network of
            certified recyclers. Our process is simple, efficient, and
            customer-friendly.
          </Typography>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <DeliveryIcon className="text-green-600 mt-1" />
              <span className="text-gray-700">
                <strong>Doorstep Pickup:</strong> Schedule collection as per
                your convenience.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <VerifiedIcon className="text-blue-600 mt-1" />
              <span className="text-gray-700">
                <strong>Trained & Verified Staff:</strong> Our team uses Smart
                Weighing Scales for accuracy.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CalendarIcon className="text-yellow-600 mt-1" />
              <span className="text-gray-700">
                <strong>Flexible Scheduling:</strong> Book on the date and time
                that suits you best.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <RecyclingIcon className="text-emerald-600 mt-1" />
              <span className="text-gray-700">
                <strong>Eco-friendly Recycling:</strong> We ensure responsible
                disposal of scrap.
              </span>
            </li>
          </ul>
        </Box>

        {/* Right box: image */}
        <Box className="w-full md:w-1/2 flex justify-center">
          <img
            src={garbageCollectionImage}
            alt="Scrap Pickup Illustration"
            className="w-full max-w-[500px] h-auto object-contain"
          />
        </Box>
      </div>

      {/* CTA Button */}
      <div className="mt-12 flex justify-center">
        <Button
          variant="contained"
          size="large"
          className="rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-all duration-300"
          sx={{
            borderRadius: 15
          }}
          onClick={handleOpenDialog}
        >
          Book Your Scrap Pickup Now
        </Button>
      </div>

      {/* <QuickScrapPickupFormDialog open={openDialog} onClose={handleCloseDialog} /> */}
      <QuickBookDialog open={openDialog} onClose={handleCloseDialog}/>
    </section>
    
  );
};

export default WhyChooseUsPage;
