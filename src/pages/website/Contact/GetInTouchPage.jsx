import React from "react";
import { Box, Typography } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const GetInTouchPage = () => {
  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        color="green"
        mb={2}
      >
        Get in Touch
      </Typography>

      {/* Quote */}
      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        mb={4}
      >
        “We’re just one message away. Let’s build something sustainable together.” 🌱
      </Typography>

      {/* Contact Info */}
      <Box display="flex" flexDirection="column" gap={1}>
        {/* Address */}
        <Box display="flex" alignItems="flex-start">
          <LocationOnIcon sx={{ color: "green", fontSize: 30, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Our Office
            </Typography>
            <Typography variant="body2" color="text.secondary">
            C2-043, Sobha City, Sector-108, Gurugram - 122017
            </Typography>
          </Box>
        </Box>

        {/* Phone */}
        <Box display="flex" alignItems="center">
          <PhoneIcon sx={{ color: "green", fontSize: 26, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Call Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              +91 9289193001
            </Typography>
          </Box>
        </Box>

        {/* Email */}
        <Box display="flex" alignItems="center">
          <EmailIcon sx={{ color: "green", fontSize: 26, mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Email Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
            wasteologymanagement@gmail.com
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GetInTouchPage;
