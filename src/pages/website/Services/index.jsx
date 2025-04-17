import React from "react";
import ServiceHeroSection from "./ServiceHeroSectionPage";
import ServiceAreaSection from "./ServiceAreaSectionPage";
import WhatWeOfferSection from "./WhatWeOfferSectionPage";
import HowItWorksSection from "./HowItWorksSectionPage";
import BookNowCTA from "./BookNowCTAPage";
import TestimonialsPage from "./TestimonialsPage";
import StatPage from "./StatPage";

const ServicePage = () => {
  return (
    <div className="bg-white pb-10">
      <ServiceHeroSection />
      <ServiceAreaSection />
      <WhatWeOfferSection />
      <HowItWorksSection />
      {/* <TestimonialsPage /> */}
      {/* <StatPage /> */}
      <BookNowCTA />
    </div>
  );
};

export default ServicePage;
