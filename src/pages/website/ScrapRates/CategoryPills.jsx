import React from "react";

const CategoryPills = ({ categories = [], selected, onSelect }) => {
  return (
    <div className="flex overflow-x-auto gap-3 pb-3 mb-6 no-scrollbar scroll-smooth">
      {categories.map((category) => {
        const isActive = selected === category;

        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border shadow-sm ${
              isActive
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-emerald-50 hover:border-emerald-400"
            }`}
          >
            {category.replace(/_/g, " ")}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPills;
