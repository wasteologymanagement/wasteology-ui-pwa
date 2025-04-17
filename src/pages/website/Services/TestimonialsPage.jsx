import { Box, Container } from "@mui/material";
import React from "react";

const testimonials = [
  {
    name: "Amit Sharma",
    feedback:
      "Excellent service! The pickup was timely and the process was seamless.",
    avatar: "path_to_amit_avatar.jpg",
  },
  {
    name: "Priya Verma",
    feedback: "Very professional and eco-friendly approach. Highly recommend!",
    avatar: "path_to_priya_avatar.jpg",
  },
  {
    name: "Rajesh Kumar",
    feedback: "Transparent pricing and great customer support.",
    avatar: "path_to_rajesh_avatar.jpg",
  },
];

const TestimonialsPage = () => {
  return (
    <Box className="py-16 bg-gray-50">
      <Container maxWidth="md">
        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Customers Say
        </h2>
        <div className="space-y-8">
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              className="bg-white p-6 rounded-xl shadow-md flex items-center"
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p className="text-gray-700">{testimonial.feedback}</p>
                <h4 className="mt-2 font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
              </div>
            </Box>
          ))}
        </div>
      </Container>
    </Box>
  );
};

export default TestimonialsPage;
