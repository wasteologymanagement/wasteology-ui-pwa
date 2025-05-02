import React from "react";
import { Container, Grid } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import ExploreIcon from "@mui/icons-material/Explore";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const visionData = [
  {
    icon: <PublicIcon fontSize="large" className="text-green-600" />,
    title: "Vision",
    content:
      "To be an expert and committed waste management company, we aim to create a sustainable environment by collecting all types of waste and recycling them, contributing to a better society for everyone.",
    gradient: "from-green-50 via-green-100 to-white",
  },
  {
    icon: <ExploreIcon fontSize="large" className="text-yellow-600" />,
    title: "Mission",
    content:
      "Our mission is to deliver EPR Service. Extended Producer Responsibility (EPR) is a crucial component of waste management, ensuring the responsible disposal of electronic devices that are no longer useful to consumers. At Wasteology, we provide EPR certification to manufacturers and producers of electronic items, helping them fulfill their compliance under the E-Waste Policy 2024..",
    gradient: "from-yellow-50 via-yellow-100 to-white",
  },
  {
    icon: <TrackChangesIcon fontSize="large" className="text-blue-600" />,
    title: "Goal",
    content:
      "To continually enhance our services and expand our reach, enabling more clients to achieve success and experience growth through our dedicated efforts.",
    gradient: "from-blue-50 via-blue-100 to-white",
  },
];

const VisionMissionGoalPage = () => {
  return (
    <>
      
      <Container maxWidth="lg" className="pb-10 mt-4 px-4 sm:px-6 lg:px-8">
        <Grid container spacing={6}>
          {visionData.map((item, idx) => (
            <Grid key={idx} item xs={12} md={4}>
              <div
                className={`bg-gradient-to-br ${item.gradient} p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col items-center text-center`}
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-green-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {item.content}
                </p>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default VisionMissionGoalPage;
