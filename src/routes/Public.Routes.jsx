import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import WebsiteLayout from "../layouts/WebsiteLayout";
import WebsiteContents from "../components/WebsiteContents";
import HomePage from "../pages/website/Home/index";
import AboutUsPage from "../pages/website/About/index";
import ServicePage from "../pages/website/Services/index";
import ScrapeRatesPage from "../pages/website/ScrapRates";
import ContactUsPage from "../pages/website/Contact";
import UserRegistrationForm from "../components/UserRegistrationForm";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* 🌐 Public Website Pages */}
      <Route
        path="/"
        element={
          <WebsiteLayout>
            <WebsiteContents />
          </WebsiteLayout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="scrap-rates" element={<ScrapeRatesPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="services" element={<ServicePage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="pricing" element={<ScrapeRatesPage />} />
        <Route path="signup" element={<UserRegistrationForm />} />
      </Route>
      {/* <Route key='login' path="/login" element={<Login />} /> */}
    </Routes>
  );
};

export default PublicRoutes;
