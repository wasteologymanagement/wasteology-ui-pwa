import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import WelcomePage from "../pages/welcome/WelcomePage";
import UserLoginPage from "../pages/auth/UserLoginPage";

const PublicRoutes = () => {
  return (

    <Routes>
      {/* Default route goes to WelcomePage */}
      <Route path="/" element={<WelcomePage />} />
      {/* Auth routes */}
      <Route path="/login/customer" element={<UserLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
    </Routes>
  );
};

export default PublicRoutes;
