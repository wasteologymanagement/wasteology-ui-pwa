import React from "react";
import { motion } from "framer-motion";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { IconButton, Box, Typography } from "@mui/material";

const FloatingWhatsApp = () => {
  const phoneNumber = "919289193001"; // Update with your real number
  const message = "Hello, I need some help!";

  const isMobile =
    /iPhone|Android|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

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
            width: 60,
            height: 60,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "#1DA851",
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </motion.div>

      <Typography
        variant="body2"
        sx={{
          marginTop: 1,
          color: "#000",
          padding: "8px 14px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "bold",
          width: "220px",
          textAlign: "center",
          whiteSpace: "pre-line",
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(0, 0, 0, 0.2)",
        }}
      >
        Facing Problems?{"\n"}Call us at +91 {phoneNumber}
      </Typography>
    </Box>
  );
};

export default FloatingWhatsApp;
