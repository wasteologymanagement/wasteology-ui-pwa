import { MdInfoOutline, MdPhone } from "react-icons/md";
import QuickScrapPickupFormDialog from "../../../components/QuickScrapPickupFormDialog";
import { useState } from "react";
import { Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomDialog from "../../../components/customeDialog";

const ImportantNotesCard = () => {

  const [openDialog, setOpenDialog] = useState(false);
  
    const handleOpenDialog = () => {
      setOpenDialog(true);
    };
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

  return (
    <div className="mx-4 sm:mx-auto max-w-3xl bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl p-4 sm:p-5 mb-10 transition-all duration-300">
      <div className="flex items-center justify-center mb-3">
        <div className="text-yellow-600 p-2 rounded-full">
          <MdInfoOutline className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
      </div>

      <h3 className="text-center text-lg sm:text-xl font-bold text-green-800 mb-3 tracking-wide">
        Important Notes
      </h3>

      <ul className="text-sm sm:text-base text-gray-700 space-y-3 list-none">
        <li className="flex items-start gap-2">
          <span className="mt-1 w-2 h-2 rounded-full bg-green-800 shrink-0"></span>
          <span>
            Price Change for bulk Quantity. To get a quote, contact us for bulk
            scrap at{" "}
            <a
              href="tel:+919289193001"
              className="inline-flex items-center font-semibold text-green-700 hover:underline transition hover:text-green-800"
            >
              <MdPhone className="mr-1 inline-block" /> +91-9289193001
            </a>
          </span>
        </li>

        <li className="flex items-start gap-2">
          <span className="mt-1 w-2 h-2 rounded-full bg-green-800 shrink-0"></span>
          <span>
            The price may vary upon pickup of the scrap material, which could
            differ from what is shown in the image provided.
          </span>
        </li>

        <li className="flex items-start gap-2">
          <span className="mt-1 w-2 h-2 rounded-full bg-green-800 shrink-0"></span>
          <span>
            Minimum Scrap Pickup Value Should be:{" "}
            <span className="text-green-700 font-semibold">₹250</span>
          </span>
        </li>
      </ul>

      <div className="text-center mt-4">
        {/* Book Now button on mobile */}
        <Button
          onClick={handleOpenDialog}
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
      </div>

      {/* <QuickScrapPickupFormDialog
        open={openDialog}
        onClose={handleCloseDialog}
      /> */}

      <CustomDialog open={openDialog} onClose={handleCloseDialog} />
    </div>
  );
};

export default ImportantNotesCard;
