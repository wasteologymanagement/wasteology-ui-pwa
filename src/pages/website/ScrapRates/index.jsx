// import React, { useEffect, useState } from "react";
// import { fetchCategories } from "../../../service/apiServices/scrapRatesService";
// import SearchBar from "./SearchBar";
// import ImportantNotesCard from "./NoteCard";
// import CategoryPills from "./CategoryPills";

// const ScrapRatePage = () => {
//   const [categoriesPrice, setCategoriesPrice] = useState(null);
//   const [filteredData, setFilteredData] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   useEffect(() => {
//     const fetchPricingData = async () => {
//       try {
//         const priceResponse = await fetchCategories();
//         setCategoriesPrice(priceResponse);
//         setFilteredData(priceResponse);
//       } catch (error) {
//         console.error("Error fetching pricing data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPricingData();
//   }, []);

//   useEffect(() => {
//     if (!categoriesPrice) return;

//     const query = searchQuery.toLowerCase();

//     const filtered = Object.keys(categoriesPrice).reduce((acc, category) => {
//       if (selectedCategory !== "All" && selectedCategory !== category)
//         return acc;

//       const matches = categoriesPrice[category].filter((item) =>
//         item.title.toLowerCase().includes(query)
//       );

//       if (
//         matches.length > 0 ||
//         category.replace(/_/g, " ").toLowerCase().includes(query)
//       ) {
//         acc[category] =
//           matches.length > 0 ? matches : categoriesPrice[category];
//       }

//       return acc;
//     }, {});
//     setFilteredData(filtered);
//   }, [searchQuery, selectedCategory, categoriesPrice]);

//   const categoryList = categoriesPrice
//     ? ["All", ...Object.keys(categoriesPrice)]
//     : [];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-6">
//       <main className="max-w-6xl mx-auto">
//         <div className="text-center mb-6">
//         <h4
//             variant="h4"
//             className="text-green-800 font-extrabold text-3xl sm:text-4xl md:text-5xl leading-tight mb-3"
//           >
//             Scrap <span className="text-green-600">Rates</span>
//           </h4>
//           <p className="text-sm text-gray-500 mt-1">
//             Updated prices for recyclable materials. Transparent rates,
//             real-time value.
//           </p>
//         </div>

//         {/* Search Input */}
//         <div className="flex justify-center mb-4">
//           <SearchBar
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />
//         </div>

//         {/* Sticky Floating Note */}
//         <ImportantNotesCard />

//         {/* Category Pills */}
//         <div className="flex justify-center mb-4">
//           <CategoryPills
//             categories={categoryList}
//             selected={selectedCategory}
//             onSelect={(cat) => setSelectedCategory(cat)}
//           />
//         </div>

//         {/* Cards Section */}
//         {loading ? (
//           <div className="flex justify-center mt-10">
//             <div className="h-8 w-8 border-4 border-emerald-500 border-dashed rounded-full animate-spin"></div>
//           </div>
//         ) : filteredData && Object.keys(filteredData).length > 0 ? (
//           Object.keys(filteredData).map((category) => (
//             <div key={category} className="mb-12">
//               <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 text-center">
//                 {category.replace(/_/g, " ")}
//               </h3>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                 {filteredData[category].map((item) => (
//                   <div
//                     key={item.id}
//                     className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md border border-gray-100 transition"
//                   >
//                     <img
//                       src={item.imageLink || "/fallback-image.jpg"}
//                       alt={item.imageDesc || "Scrap item"}
//                       className="h-20 w-full object-contain bg-gray-50 rounded-md mb-3"
//                       onError={(e) => (e.target.src = "/fallback-image.jpg")}
//                     />
//                     <div className="text-center">
//                       <h4 className="font-medium text-gray-700 text-lg truncate">
//                         {item.title}
//                       </h4>
//                       <p className="text-emerald-600 font-semibold text-xl mt-1">
//                         ₹{item.price} {item.perUnit}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-sm text-gray-500 mt-10">
//             No matching results found.
//           </p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ScrapRatePage;
