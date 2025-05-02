import React from "react";
import { motion } from "framer-motion";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton, Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const FloatingWhatsApp = () => {
  const phoneNumber = "919289193001"; // Update with your real number
  const message = "Hello, I need some help!";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => {
    const baseUrl = isMobile
      ? "https://api.whatsapp.com/send"
      : "https://web.whatsapp.com/send";
    const whatsappUrl = `${baseUrl}?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <IconButton
          onClick={handleClick}
          sx={{
            backgroundColor: "#25D366",
            color: "#fff",
            width: isMobile ? 45 : 60,
            height: isMobile ? 45 : 60,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#1DA851",
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: isMobile ? 28 : 40 }} />
        </IconButton>
      </motion.div>

      {!isMobile && (
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "#000",
            px: 2,
            py: 1,
            borderRadius: "10px",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "bold",
            width: isMobile ? "160px" : "220px",
            textAlign: "center",
            whiteSpace: "pre-line",
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          Facing Problems?{"\n"}Call us at +{phoneNumber}
        </Typography>
      )}
    </Box>
  );
};

export default FloatingWhatsApp;
