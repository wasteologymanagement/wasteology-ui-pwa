import React from "react";
import {
    Container,
    Typography,
    Grid,
    Box,
  } from "@mui/material";

const teamMembers = [
    { name: "Amit Verma", role: "Founder & CEO" },
    { name: "Priya Sharma", role: "Operations Manager" },
    { name: "Rohan Das", role: "Tech Lead" },
  ];

const TeamPage = ({ showTeam }) => {
  return (
    <>
      {showTeam && (
        <Box className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
          <Container maxWidth="lg">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 text-center mb-6 tracking-tight">
              Meet Our <span className="text-green-600">Team</span>
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
              Passionate professionals working together to create meaningful
              impact.
            </p>

            <Grid container spacing={4} justifyContent="center">
              {teamMembers.map((member, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 text-center p-6">
                    <Box className="flex justify-center mb-4">
                      <img
                        src={`https://via.placeholder.com/150?text=${encodeURIComponent(
                          member.name
                        )}`}
                        alt={member.name}
                        className="w-28 h-28 object-cover rounded-full border-4 border-green-100"
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      className="text-green-800 font-semibold mb-1"
                    >
                      {member.name}
                    </Typography>
                    <Typography className="text-gray-600 text-sm">
                      {member.role}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
};

export default TeamPage;
