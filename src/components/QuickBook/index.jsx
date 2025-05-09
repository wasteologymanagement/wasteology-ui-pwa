import React from "react";
import { Dialog, useMediaQuery, useTheme, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/logo/logo4.png";

const QuickBookDialog = ({ open, onClose, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const brandPrimary = "#00756d";

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          overflow: "hidden",
          m: { xs: 0, sm: 2 },
          position: "relative",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="relative w-full h-[100vh] md:h-[80vh] max-h-screen">
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          aria-label="close"
          className="!absolute top-2 right-2 sm:top-4 sm:right-4 z-50"
        >
          <CloseIcon />
        </IconButton>

        {/* Scrollable Container */}
        <div className="flex flex-col md:flex-row h-full max-h-screen overflow-y-auto">
          {/* Left Section */}
          <div className="flex flex-col items-center justify-center text-center bg-[#00756d] p-6 sm:p-8 md:flex-[4]">
            <img
              src={logo}
              alt="Logo"
              className="w-60 sm:w-24 md:w-120 mb-4 sm:mb-6"
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-amber-300">
              Schedule Your Trash Pickup
            </h2>
            <p className="text-sm sm:text-base text-white px-2 sm:px-4">
              Book your pickup in just a few steps. We collect your waste and
              pay you the right amount.
            </p>
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-start items-stretch bg-white p-4 sm:p-8 md:p-10 md:flex-[8] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default QuickBookDialog;
