import { Box, Container } from "@mui/material";
import React from "react";
const stats = [
  { label: "Happy Customers", value: "10K+" },
  { label: "Pickups Completed", value: "25K+" },
  { label: "Areas Served", value: "50+" },
  { label: "Tons Recycled", value: "1K+" },
];

const StatPage = () => {
  return (
    <Box className="py-16 bg-white">
      <Container maxWidth="lg">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Impact in Numbers
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <Box key={index} className="p-6 border rounded-xl shadow-sm">
              <h3 className="text-4xl font-bold text-green-700">
                {stat.value}
              </h3>
              <p className="mt-2 text-gray-600">{stat.label}</p>
            </Box>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default StatPage;
