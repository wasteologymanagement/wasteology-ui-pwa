import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const REDIRECT_TIME = 15; // seconds

const SubmissionSuccessPage = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_TIME);

  useEffect(() => {
    // countdown timer
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    // auto redirect
    const redirectTimer = setTimeout(() => {
      navigate("/app/picker/trash-list"); // 👈 change target route
    }, REDIRECT_TIME * 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Box
      minHeight="50vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
    >
      <Stack
        spacing={2}
        alignItems="center"
        maxWidth={420}
        width="100%"
        textAlign="center"
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />

        <Typography variant="h5" fontWeight={600}>
          Submission Successful 🎉
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Your request has been submitted successfully.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          You will be redirected automatically in{" "}
          <strong>{secondsLeft}</strong> seconds.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2, borderRadius: 2 }}
          onClick={() => navigate("/app/picker/trash-list")} // 👈 same redirect
        >
          Go to Dashboard
        </Button>
      </Stack>
    </Box>
  );
};

export default SubmissionSuccessPage;
