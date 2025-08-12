// src/layouts/WebsiteLayout.jsx
import React from "react";
import { Box, Container } from "@mui/material";
import Navbar from "../components/WebsiteNavbar"; // or MobileNavToggle
import WebsiteFooter from "../components/WebsiteFooter";
// import HomePage from "../pages/website/Home";

const WebsiteLayout = ({ children }) => {
  return (
    <Box className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main content area */}
      <main className="flex-grow">{children}</main>

      <WebsiteFooter />
    </Box>
  );
};

export default WebsiteLayout;
