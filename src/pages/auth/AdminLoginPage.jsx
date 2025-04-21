import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLoginPng from "../../assets/admin_login.png";
import { Snackbar, Alert } from "@mui/material";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setAlertMessage("Please enter both username and password");
      setAlertType("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    // Simulate authentication (replace with actual API call)
    setTimeout(() => {
      setLoading(false);
      // Check for hardcoded credentials for demo
      if (username === "admin" && password === "admin123") {
        setAlertMessage("Login successful!");
        setAlertType("success");
        setOpenSnackbar(true);
        navigate("/admin/dashboard"); // Redirect to admin dashboard
      } else {
        setAlertMessage("Invalid username or password");
        setAlertType("error");
        setOpenSnackbar(true);
      }
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-100 to-white px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <img
            src={adminLoginPng}
            alt="Admin Login Vector"
            className="h-32 mx-auto mb-4 sm:h-40 md:h-48"
          />
          <h2 className="text-3xl font-semibold text-gray-800">Team Login</h2>
          <p className="text-sm text-gray-500">Login using your credentials</p>
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-600">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 outline-none text-lg"
        />

        <label className="block mb-2 text-sm font-medium text-gray-600">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-6 outline-none text-lg"
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-3xl font-semibold"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        By continuing, you agree to our <span className="underline">Terms</span>{" "}
        and <span className="underline">Privacy Policy</span>.
      </p>

      {/* Snackbar for Alerts */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminLoginPage;
