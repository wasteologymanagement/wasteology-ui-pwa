import React from "react";
import { Box, Container } from "@mui/material";
import CityCard from "./CityCard";
import delhiIcon from "../../../assets/cityImages/delhi_city.png";
import gurgaonIcon from "../../../assets/cityImages/gurgaon_city.png";

const cityData = [
  {
    name: "Delhi",
    icon: delhiIcon,
    description: "Residential & commercial pickups across all major zones of Delhi.",
  },
  {
    name: "Gurgaon",
    icon: gurgaonIcon,
    description: "Available throughout Gurgaon, including tech parks and residential sectors.",
  },
];

const ServiceAreaSection = () => {
  return (
    <Box className="py-0 sm:py-5 bg-transparent">
      <Container maxWidth="md" className="px-4">
        <h2
          className="text-green-800 font-extrabold text-3xl sm:text-4xl text-center mb-8 tracking-tight"
          data-aos="fade-up"
        >
          Currently Serving
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          {cityData.map((city, index) => (
            <CityCard
              key={city.name}
              {...city}
              animationDelay={index * 100}
            />
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default ServiceAreaSection;
