import React, { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import QuickScrapPickupFormDialog from "../../../components/QuickScrapPickupFormDialog";

const BookNowCTA = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box className="bg-gray-100 rounded-[40px] px-6 py-10 mx-4 sm:mx-auto max-w-4xl text-center">
      <Stack spacing={3} alignItems="center">
        <Typography
          variant="h5"
          fontWeight={700}
          className="text-xl sm:text-2xl md:text-3xl"
        >
          Book a Pickup Request Now
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="text-sm sm:text-base"
        >
          Schedule your scrap pickup with ease. Select your time, enter your
          address, and let us handle the rest!
        </Typography>
        <Button
          // onClick={handleOpenDialog}
          variant="contained"
          size="large"
          className="!bg-green-700 hover:!bg-green-800 text-white px-6 py-3 text-base sm:text-lg shadow-none"
          endIcon={<ArrowForwardIcon style={{ transform: "rotate(-45deg)" }} />}
          sx={{
            borderRadius: 25,
          }}
        >
          Book a Pickup
        </Button>
      </Stack>

      <QuickScrapPickupFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default BookNowCTA;
