// import React, { useState } from "react";
// import {
//   Container,
//   Grid,
//   TextField,
//   InputAdornment,
//   Button,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import PhoneVerification from "../../../components/PhoneVerification";
// import { authenticateUser } from "../../../service/apiServices/authService";
// import { saveTokens } from "../../../utils/tokensUtils";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";

// import {
//   fetchUserByPhoneNumber,
//   loginSuccess,
//   // loginFailure,
//   // setAuthToken,
// } from "../../../store/slice/userSlice";
// import ScrapRatesCTA from "./ScrapRatesCTA";

// const BookNowPage = () => {
//   const [step, setStep] = useState(1);
//   const [phone, setPhone] = useState("");
//   const [errors, setErrors] = useState(null);

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleProceed = () => {
//     if (phone.length === 10) {
//       setStep(2);
//     } else {
//       alert("Please enter a valid 10-digit phone number");
//     }
//   };

//   const handleVerified = async () => {
//     try {
//       const tokens = await fetchAccessToken();
//       // dispatch(setAuthToken(tokens.accessToken)); // Save in redux
//       await handleCheckUser();
//     } catch (error) {
//       console.error("Verification Error:", error);
//       setErrors("Verification failed.");
//     }
//   };

//   const fetchAccessToken = async () => {
//     try {
//       const password = "admin";
//       const response = await authenticateUser(password);
//       if (!response || !response.accessToken) {
//         throw new Error("Authentication failed.");
//       }

//       saveTokens({
//         accessToken: response.accessToken,
//         refreshToken: response.refreshToken,
//       });

//       return {
//         accessToken: response.accessToken,
//         refreshToken: response.refreshToken,
//       };
//     } catch (error) {
//       console.error("Error fetching token:", error);
//       throw error;
//     }
//   };

//   const handleCheckUser = async () => {
//     try {
//       const prefixPhoneNumber = `+91${phone}`;
//       const userData = await dispatch(
//         fetchUserByPhoneNumber(prefixPhoneNumber)
//       ).unwrap();

//       // Explicitly check for 404 status
//       if (userData?.status === 404) {
//         //if user not found open registration form component
//         navigate("/signup", {
//           state: { phone }, // 👈 Pass it like this
//         });
//       } else {
//         dispatch(loginSuccess(userData));
//         navigate("/app/user/schedule");
//       }
//     } catch (error) {
//       // dispatch(loginFailure());
//       console.error("Error checking user:", error);
//       setErrors("User not found or server error.");
//     }
//   };

//   return (
//     <>
//       <div className="bg-white flex items-center py-2 sm:py-12 md:py-8">
//         <Container
//           maxWidth="md"
//           className="bg-white rounded-2xl px-4 py-4 sm:px-8 sm:py-5 shadow-lg"
//         >
//           {step === 1 && (
//             <>
//               <p className="text-sm sm:text-xl text-center text-green-800 mb-2 sm:mb-3">
//                 Start making a difference with every pickup. Join us in creating
//                 a cleaner, greener future. It takes just a few seconds!
//               </p>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-6 leading-snug">
//                 Schedule pickup now!
//               </h2>
//               <Grid container spacing={3} justifyContent="center">
//                 <Grid item xs={12} sm={6} md={4}>
//                   <TextField
//                     fullWidth
//                     required
//                     label="Phone Number"
//                     variant="outlined"
//                     size="small"
//                     type="tel"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     inputProps={{
//                       maxLength: 10,
//                       inputMode: "numeric",
//                       pattern: "\\d*",
//                     }}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">🇮🇳 +91</InputAdornment>
//                       ),
//                       style: {
//                         borderRadius: 15,
//                         backgroundColor: "#fff",
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={12} md={2} className="text-center">
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                       borderRadius: 50,
//                       fontWeight: 600,
//                       textTransform: "none",
//                       fontSize: "1rem",
//                       boxShadow: theme.shadows[3],
//                       "&:hover": {
//                         background:
//                           "linear-gradient(to right, #009624, #007e33)",
//                       },
//                     }}
//                     onClick={handleProceed}
//                   >
//                     Proceed
//                   </Button>
//                 </Grid>
//               </Grid>
//             </>
//           )}

//           {step === 2 && (
//             <PhoneVerification
//               phoneNumber={phone}
//               onVerified={handleVerified}
//             />
//           )}

//           {errors && <p className="text-red-600 text-center mt-4">{errors}</p>}
//         </Container>
//       </div>
      
//       {/* <ScrapRatesCTA /> */}
//     </>
//   );
// };

// export default BookNowPage;
