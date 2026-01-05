import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
import WelcomePage from "../pages/welcome/WelcomePage";
import UserLoginPage from "../pages/auth/UserLoginPage";
import TestPage from "../pages/picker/TestPage";
import PickerItemsPage from "../pages/picker/Picker.PickerItemCheckPage";

const PublicRoutes = () => {
  return (

    <Routes>
      {/* Default route goes to WelcomePage */}
      <Route path="/" element={<WelcomePage />} />
      {/* Auth routes */}
      <Route path="/login/customer" element={<UserLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/login/test" element={<TestPage />} />
      <Route path="/profile2" element={<PickerItemsPage />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
};

export default PublicRoutes;
