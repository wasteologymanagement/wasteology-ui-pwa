// src/pages/HomePage.jsx
import React from "react";
import WebsiteLayout from "../../../layouts/WebsiteLayout";
import { Typography, Button, Grid, Box, Paper } from "@mui/material";
import {
  FaTruckPickup,
  FaMoneyBillWave,
  FaClipboardList,
} from "react-icons/fa";
import HeroSection from "./HeroSection";
import HowItWorkSection from "./HowItWorkSection";
import BookNowSection from "./BookNowSection";
import WhyChooseUsSection from "./WhyChooseUsSection";

const howItWorksData = [
  {
    icon: <FaClipboardList size={36} className="text-green-600 mx-auto mb-2" />,
    title: "1. Book Pickup",
    desc: "Submit a pickup request easily online.",
  },
  {
    icon: <FaTruckPickup size={36} className="text-green-600 mx-auto mb-2" />,
    title: "2. We Arrive",
    desc: "Our picker reaches your location on time.",
  },
  {
    icon: <FaMoneyBillWave size={36} className="text-green-600 mx-auto mb-2" />,
    title: "3. Get Paid",
    desc: "Receive cash or online payment instantly.",
  },
];

const HomePage = () => (
  <div className="bg-white">
    {/* Hero Section */}
    <HeroSection />

    {/* Book Now Section */}
    <BookNowSection />

    {/* How It Works Section */}
    <HowItWorkSection />

    {/* Why Choose Us Section */}
    <WhyChooseUsSection />


    {/* <section className="bg-white py-16 px-4 md:px-10">
  <Typography
    variant="h4"
    className="text-center font-bold mb-14 text-gray-800 text-3xl md:text-4xl"
  >
    How It Works
  </Typography>

  <Grid container spacing={6} justifyContent="center">
    {howItWorksData.map((step, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Paper
          elevation={6}
          className="rounded-2xl p-8 text-center bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full shadow-md">
              {step.icon}
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Step {index + 1}: {step.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {step.desc}
          </p>
        </Paper>
      </Grid>
    ))}
  </Grid>
</section> */}


    {/* CTA Section */}
    {/* <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-center text-white">
      <Typography variant="h4" className="font-bold text-2xl sm:text-3xl">
        Ready to Book a Pickup?
      </Typography>
      <p className="mt-3 text-white/80 text-base sm:text-lg">
        It’s quick, eco-friendly, and rewarding. Make a difference today.
      </p>
      <Button
        variant="contained"
        className="mt-6"
        sx={{
          backgroundColor: "#fff",
          color: "rgb(22,163,74)",
          borderRadius: "999px",
          textTransform: "none",
          fontWeight: "bold",
          px: 5,
          py: 1.5,
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#f3f3f3",
          },
        }}
      >
        Get Started
      </Button>
    </section> */}
  </div>
);

export default HomePage;
