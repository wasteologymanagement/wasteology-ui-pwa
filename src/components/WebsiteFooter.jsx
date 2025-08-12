// import React from "react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
//   FaPinterest,
//   // FaThreads
// } from "react-icons/fa";
// import logo2 from "../assets/logo/logo4.png"

// const WebsiteFooter = () => (
//   <footer
//     className="text-white pt-12"
//     style={{ backgroundColor: "rgb(51, 51, 51)" }}
//   >
//     {/* Grid Content */}
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-4 gap-10 text-center sm:text-center">
//       {/* Column 1 */}
//       <div>
//         <img
//           src={logo2} // Replace this with your actual path
//           alt="ScrapDeal Logo"
//           className="w-70 h-auto mb-4"
//         />
//         <p className="text-sm leading-relaxed text-gray-300">
//           “Empowering Sustainability, One Recycle at a Time. At Wasteology,
//           we’re passionate about making a positive impact on our environment.
//           Our mission is to promote responsible recycling practices, reduce
//           waste, and preserve our natural resources!” 🌿🌎
//         </p>
//       </div>

//       {/* Column 2 */}
//       <div>
//         <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
//         <ul className="space-y-2 text-sm text-gray-300">
//           {["About", "Scrap-Rates", "Services", "Contact", "Blog"].map((item) => (
//             <li key={item}>
//               <a
//                 href={`/${item.toLowerCase()}`}
//                 className="hover:text-white transition duration-200"
//               >
//                 {item}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Column 3 */}
//       <div>
//         <h3 className="text-xl font-bold mb-4 text-white">Other Resources</h3>
//         <ul className="space-y-2 text-sm text-gray-300">
//           {["Privacy Policy", "Terms of Service", "Refund Policy", "FAQ"].map(
//             (item) => (
//               <li key={item}>
//                 <a
//                   href={`/${item.toLowerCase().replace(/ /g, "-")}`}
//                   className="hover:text-white transition duration-200"
//                 >
//                   {item}
//                 </a>
//               </li>
//             )
//           )}
//         </ul>
//       </div>

//       {/* Column 4 */}
//       <div>
//         <h3 className="text-xl font-bold mb-4 text-white">Get in Touch</h3>
//         {/* <p className="text-sm leading-relaxed text-gray-300">          
//           <strong>Address:</strong> C2-043 Sobha City, Sector-108 Gurugram -
//           122017
//         </p> */}
//         <p className="text-sm leading-relaxed text-gray-300"><strong>Phone:</strong> +91 9289193001</p>
//         <p className="text-sm leading-relaxed text-gray-300"><strong>Email:</strong> wasteologymanagement@gmail.com</p>
//       </div>
//     </div>

//     {/* Gradient Divider */}
//     <div className="my-8 h-[1px] w-full bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>

//     {/* Bottom Bar */}
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
//       <p className="text-sm text-gray-400">
//         &copy; {new Date().getFullYear()} Wasteology. All rights reserved.
//       </p>
//       <div className="flex gap-4 text-lg">
//         {[
//           { icon: FaFacebookF, link: "https://www.facebook.com/profile.php?id=61568282364849" },
//           { icon: FaTwitter, link: "https://x.com/wasteology01" },
//           { icon: FaInstagram, link: "https://www.instagram.com/wasteologymanagement/" },
//           { icon: FaPinterest, link: "https://in.pinterest.com/officialwasteology" },
//           // { icon: FaThreads, link: "https://www.threads.net/@officialwasteology" },
//         ].map(({ icon: Icon, link }, idx) => (
//           <a
//             key={idx}
//             href={link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:text-white transition duration-300 rounded-full border border-white/20 p-2 hover:bg-white/10"
//           >
//             <Icon />
//           </a>
//         ))}
//       </div>
//     </div>
//   </footer>
// );

// export default WebsiteFooter;
