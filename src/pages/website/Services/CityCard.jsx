import React from "react";

const CityCard = ({ name, icon, description, animationDelay = 0 }) => {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay={animationDelay}
      className="flex-1 bg-white rounded-3xl shadow-md hover:shadow-xl transition duration-300 p-6 flex flex-col items-center text-center hover:scale-[1.02] border-t-4 border-green-600"
    >
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-teal-50 border border-teal-200 shadow-sm flex items-center justify-center mb-5">
        <img
          src={icon}
          alt={`${name} icon`}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
        />
      </div>
      <h3 className="text-teal-700 font-semibold text-xl sm:text-2xl mb-1">
        {name}
      </h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
};

export default CityCard;
