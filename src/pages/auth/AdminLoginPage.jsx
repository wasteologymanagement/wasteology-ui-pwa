import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminLoginPng from "../../assets/admin_login.png";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch } from 'react-redux';
import { loginAdminSuccess, loginSuccess } from '../../store/slice/userSlice'; // Admin login success action
import { authenticateUser } from '../../service/apiServices/authService';
import { loginApi } from '../../service/apiServices/loginService';
import { saveTokens } from '../../utils/tokensUtils';

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (!username || !password) {
      setAlertMessage("Please enter both username and password");
      setAlertType("error");
      setOpenSnackbar(true);
      return;
    }
  
    setLoading(true);
  
    try {
      const loginResponse = await loginApi({ username, password });
  
      console.log("Login response:", loginResponse);
  
      if (!loginResponse) {
        setAlertMessage("Login failed. Please try again.");
        setAlertType("error");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }
  
      const response = await authenticateUser(password);
  
      console.log("Authentication response:", response);
  
      if (!response || !response.accessToken) {
        setAlertMessage("Authentication failed. Please try again.");
        setAlertType("error");
        setOpenSnackbar(true);
        setLoading(false);
        return;
      }
  
      saveTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
  
      // Verify if `userRole` is present
      console.log("User role in loginResponse:", loginResponse.userRole);
  
      if (loginResponse.userRole === "admin") {
        // Ensure we are sending the correct payload
        dispatch(
          loginSuccess({
            role: loginResponse.userRole,
            ...loginResponse,
          })
        );
  
        navigate("/app/admin/dashboard");
      } else if (loginResponse.userRole === "wl-user") {
        // Ensure we are sending the correct payload
        dispatch(
          loginSuccess({
            role: "picker",
            ...loginResponse,
          })
        );
  
        navigate("/app/picker/dashboard");
      } else {
        setAlertMessage("Unauthorized user role.");
        setAlertType("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setAlertMessage("An error occurred. Please try again.");
      setAlertType("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
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
