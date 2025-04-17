import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";

const ContactForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    contact: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.firstName || !form.email || !form.contact) {
      alert("Please fill required fields: First Name, Email, Contact Number.");
      return;
    }

    console.log("Form Submitted", form);
    // Optional: Add toast or API integration
  };

  return (
    <Box
      sx={{
        maxWidth: "700px",
        mx: "auto",
        overflowY: "auto",
      }}
    >
      {/* <Typography
        variant="h6"
        className="text-green-800 font-semibold mb-4 text-center text-lg sm:text-xl"
      >
        Send Us a Message
      </Typography> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First + Last Name */}
        <Box className="flex flex-col sm:flex-row gap-3">
          <TextField
            fullWidth
            name="firstName"
            label="First Name *"
            variant="outlined"
            size="small"
            value={form.firstName}
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  // borderColor: "bg-gray-700", // Tailwind's gray-300
                  // borderRadius: 15
                },
                "&:hover fieldset": {
                  // borderColor: "bg-green-400", // Tailwind's green-400
                },
                "&.Mui-focused fieldset": {
                  // borderColor: "bg-green-700", // Tailwind's green-700
                },
              },
            }}
          />
          <TextField
            fullWidth
            name="lastName"
            label="Last Name"
            variant="outlined"
            size="small"
            value={form.lastName}
            onChange={handleChange}
          />
        </Box>

        {/* Email */}
        <TextField
          fullWidth
          name="email"
          label="Email Address *"
          type="email"
          variant="outlined"
          margin="dense"
          size="small"
          value={form.email}
          onChange={handleChange}
        />

        {/* Company Name */}
        <TextField
          fullWidth
          name="companyName"
          label="Company Name"
          variant="outlined"
          margin="normal"
          size="small"
          value={form.companyName}
          onChange={handleChange}
        />

        {/* Contact Number */}
        <TextField
          fullWidth
          name="contact"
          label="Contact Number *"
          variant="outlined"
          margin="normal"
          size="small"
          value={form.contact}
          onChange={handleChange}
          inputProps={{ maxLength: 10 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🇮🇳 +91</InputAdornment>
            ),
          }}
        />

        {/* Message */}
        <TextField
          fullWidth
          name="message"
          label="Message"
          variant="outlined"
          margin="dense"
          multiline
          rows={4}
          value={form.message}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="contained"
            size="large"
            className="bg-green-700 hover:bg-green-800 text-white py-2 transition duration-300"
            sx={{
              borderRadius: 30,
              width: "200px",
            }}
          >
            Send Message
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default ContactForm;
