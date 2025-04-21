import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";
import GetInTouchSection from "./GetInTouchPage";
import ContactForm from "./ContactFormPage";
import { useTheme } from "@mui/material/styles";

const ContactPage = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box className="bg-gradient-to-b from-green-50 via-white to-green-100 py-5 px-4 sm:px-6 md:px-8">
      <Container maxWidth="lg">
        {/* Header */}
        <Box className="text-center mb-8 px-4 sm:px-6 lg:px-8">
          <h4
            variant="h4"
            className="text-green-800 font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-3"
          >
            Contact <span className="text-green-600">Us</span>
          </h4>
          <h6
            variant="h6"
            className="text-gray-600 text-center text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
          >
            We'd love to hear from you — whether you have a question, feedback,
            or partnership idea!
          </h6>
        </Box>

        {/* Main Section */}
        <Box className="flex flex-col lg:flex-row items-start gap-4 lg:gap-10">
          {/* Left: Get In Touch Section */}
          <Box
            className="w-full lg:w-[48%] bg-white rounded-2xl shadow-md p-6 sm:p-8 transition-all duration-300"
            sx={{
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <GetInTouchSection />
          </Box>

          {/* Divider - only on large screens */}
          {isLargeScreen && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: "rgba(0, 117, 109, 0.2)" }}
            />
          )}

          {/* Right: Contact Form */}
          <Box
            className="w-full lg:w-[48%] bg-white rounded-2xl shadow-md p-3 sm:p-8 transition-all duration-300"
            sx={{
              "&:hover": {
                boxShadow: 6,
              },
            }}
          >
            <ContactForm />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
