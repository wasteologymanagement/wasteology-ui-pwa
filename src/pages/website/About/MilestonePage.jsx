import React from "react";
import { Container, Typography, Grid, Box } from "@mui/material";

const milestones = [
  {
    year: "2022",
    text: "Founded Wasteology with a vision for a cleaner India.",
  },
  {
    year: "2023",
    text: "Launched digital scrap collection services in 3 cities.",
  },
  {
    year: "2024",
    text: "Expanded to EPR certification and corporate waste pickup.",
  },
];

const MilestonePage = ({ showMilestones }) => {
  return (
    <div>
      {showMilestones && (
        <Box className="py-12 px-4 bg-gray-50">
          <Container maxWidth="md">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 text-center mb-6 tracking-tight">
              Our <span className="text-green-600">Journey</span>
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
              Discover how we started, the milestones we've reached, and the
              mission that drives us forward every day.
            </p>

            <Grid container spacing={4}>
              {milestones.map((milestone, idx) => (
                <Grid item xs={12} sm={6} md={12} key={idx}>
                  <Box className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 h-full border border-gray-100 border-l-4 border-l-green-600">
                    <Typography
                      variant="subtitle1"
                      className="text-green-700 font-bold mb-2"
                    >
                      {milestone.year}
                    </Typography>
                    <Typography className="text-gray-600 text-sm leading-relaxed">
                      {milestone.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </div>
  );
};

export default MilestonePage;
