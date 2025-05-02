import React from "react";
import {
  Container
} from "@mui/material";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const CompanyDescriptionPage = () => {
  return (
    <>
      <Container maxWidth="lg" className="py-0 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <Diversity3Icon fontSize="large" className="text-green-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 tracking-tight mb-4">
            Who <span className="text-green-600">We Are</span>
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            Wasteology Solutions is a sustainable waste collection and recycling
            company in India. Our principle: everything can be recycled when
            directed to the right facility. We bridge the gap between waste
            generators and recyclers — making it easy for households, societies,
            corporates, and industries to dispose of responsibly.
            
          </p>
        </div>
      </Container>
    </>
  );
};

export default CompanyDescriptionPage;
