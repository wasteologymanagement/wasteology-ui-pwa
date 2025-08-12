import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import WebsiteLayout from "../layouts/WebsiteLayout";
// import WebsiteContents from "../components/WebsiteContents";
// import HomePage from "../pages/website/Home/index";
// import AboutUsPage from "../pages/website/About/index";
// import ServicePage from "../pages/website/Services/index";
// import ScrapeRatesPage from "../pages/website/ScrapRates";
// import ContactUsPage from "../pages/website/Contact";
// import UserRegistrationForm from "../components/UserRegistrationForm";
import UserLoginPage from "../pages/auth/UserLoginPage";
import AdminLoginPage from "../pages/auth/AdminLoginPage";
// import FloatingWhatsApp from "../components/FloatingWhatsApp";
// import GTM from "../service/GTM";
import WelcomePage from "../pages/welcome/WelcomePage";

const PublicRoutes = () => {
  return (
    // <Routes>
    //   {/* 🌐 Public Website Pages */}
    //   <Route
    //     path="/"
    //     element={
    //       <WebsiteLayout>
    //         <GTM />
    //         <WebsiteContents />
    //         {/* Floating WhatsApp Button */}
    //         <FloatingWhatsApp />
    //       </WebsiteLayout>
    //     }
    //   >
    //     <Route index element={<HomePage />} />
    //     <Route path="scrap-rates" element={<ScrapeRatesPage />} />
    //     <Route path="about" element={<AboutUsPage />} />
    //     <Route path="services" element={<ServicePage />} />
    //     <Route path="contact" element={<ContactUsPage />} />
    //     <Route path="pricing" element={<ScrapeRatesPage />} />
    //     <Route path="signup" element={<UserRegistrationForm />} />
    //     <Route
    //       key="userLogin"
    //       path="login/customer"
    //       element={<UserLoginPage />}
    //     />
    //     <Route
    //       key="adminLogin"
    //       path="login/admin"
    //       element={<AdminLoginPage />}
    //     />
    //   </Route>
    // </Routes>

    <Routes>
      {/* Default route goes to WelcomePage */}
      <Route path="/" element={<WelcomePage />} />

      {/* Auth routes */}
      <Route path="/login/customer" element={<UserLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />

      {/* Uncomment these later if needed for public site */}
      {/* <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="scrap-rates" element={<ScrapeRatesPage />} />
        <Route path="about" element={<AboutUsPage />} />
        <Route path="services" element={<ServicePage />} />
        <Route path="contact" element={<ContactUsPage />} />
        <Route path="signup" element={<UserRegistrationForm />} />
      </Route> */}
    </Routes>
  );
};

export default PublicRoutes;
