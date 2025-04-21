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
      "To become India’s most trusted waste management partner, helping create a greener, circular economy.",
    gradient: "from-green-50 via-green-100 to-white",
  },
  {
    icon: <ExploreIcon fontSize="large" className="text-yellow-600" />,
    title: "Mission",
    content:
      "To deliver certified EPR services and smart waste solutions, enabling manufacturers and communities to fulfill environmental responsibilities.",
    gradient: "from-yellow-50 via-yellow-100 to-white",
  },
  {
    icon: <TrackChangesIcon fontSize="large" className="text-blue-600" />,
    title: "Goal",
    content:
      "To scale our operations and impact — helping thousands more reduce, reuse, and recycle through sustainable tech.",
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
