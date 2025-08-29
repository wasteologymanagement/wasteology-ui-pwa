import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { requestOtpApi, resendOtpApi, verifyOtpApi } from "../../service/apiServices/otpService";
import { saveTokens } from "../../utils/tokensUtils";
// import { loginSuccess } from "../../store/slice/userSlice";
import { useSnackbar } from "../../components/SnackbarProvider";
import { loginWithOtp } from "../../store/slice/authSlice";

const UserLoginPage = () => {

    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1); // 1 = mobile, 2 = otp
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0); // seconds countdown for OTP expiry
    const { showMessage } = useSnackbar();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const OTP_DURATION = 120; // 5 min = 300 sec

    // Countdown effect for resend OTP
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleGetOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            showMessage("Enter valid 10-digit mobile number", "error")
            return;
        }
        setLoading(true);

        // 🔥 Call backend API here to send OTP
        try {
            const response = await requestOtpApi(mobile);

            console.log("OTP request response:", response);

            if (!response?.success) {
                throw new Error(response?.message || "Failed to request OTP");
            }

            // ✅ OTP requested successfully
            setStep(2); // move to OTP entry step
            setOtp("");
            setTimer(OTP_DURATION);

            showMessage("OTP sent successfully!", "success");

        } catch (err) {
            console.error("Error requesting OTP:", err);

            showMessage(err?.message || "Something went wrong while requesting OTP", "error");

        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!/^\d{6}$/.test(otp)) {
            showMessage("Enter valid 6-digit OTP", "error");
            return;
        }
        setLoading(true);

        // 🔥 Call backend API here to verify OTP
        try {
            // const response = await verifyOtpApi(mobile, otp);
            const resultAction = await dispatch(
                loginWithOtp( {mobile, otp} )
            );

            if (loginWithOtp.rejected.match(resultAction)) {
                throw new Error(resultAction.payload || "Login failed");
            }

            const response = resultAction.payload;

            console.log("OTP verify response:", response);

            if (!response?.access_token || !response?.refresh_token) {
                throw new Error(response?.message || "Invalid or expired OTP");
            }

            // ✅ OTP verified successfully → redirect
            showMessage("OTP verified successfully!", "success");
            // saveTokens({
            //     accessToken: response.access_token,
            //     refreshToken: response.refresh_token,
            // });

            // dispatch(loginSuccess({ role: response.role, ...response }));
            navigate("/app/user/dashboard"); // or wherever you need to redirect
        } catch (err) {
            console.error("Error verifying OTP:", err);
            showMessage(err?.message || "Something went wrong while verifying OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            alert("Enter valid 10-digit mobile number");
            return;
        }
        setLoading(true);

        try {
            // 🔥 Call backend API here to resend OTP
            // await api.post("/resend-otp", { mobile });

            setTimeout(() => {
                setLoading(false);
                setOtp("");
                setTimer(OTP_DURATION); // restart 5 min timer
                alert("OTP has been resent!");
            }, 1000);

        } catch (error) {
            console.error("Resend OTP failed:", error);
            alert("Failed to resend OTP. Please try again.");
            setLoading(false);
        }
    };

    // ✅ Helper to format time as mm:ss
    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    // Circle progress for countdown
    const circleRadius = 18;
    const circumference = 2 * Math.PI * circleRadius;
    const progress =
        timer > 0 ? (timer / OTP_DURATION) * circumference : 0;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-sm bg-white shadow-xl rounded-3xl p-8 relative overflow-hidden"
            >
                {/* Decorative Circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-200 rounded-full opacity-40 animate-pulse"></div>

                <h1 className="text-2xl font-extrabold text-center text-green-700 mb-2">
                    Waste Pickup Login
                </h1>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Enter your mobile number to receive OTP
                </p>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mobile Number
                        </label>
                        <div className="flex items-center border rounded-xl overflow-hidden bg-gray-50">
                            <span className="flex items-center px-3 text-gray-700 text-sm bg-gray-100 border-r">
                                🇮🇳 +91
                            </span>
                            <input
                                type="tel"
                                maxLength={10}
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(e.target.value.replace(/\D/g, "")) // only digits
                                }
                                className="w-full px-4 py-3 bg-transparent focus:outline-none focus:ring-0"
                                placeholder="Enter 10-digit mobile"
                            />
                        </div>
                        <button
                            onClick={handleGetOtp}
                            disabled={loading}
                            className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 shadow-md transition disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Get OTP"}
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-4 py-3 border rounded-xl tracking-widest text-center focus:ring-2 focus:ring-green-500 outline-none text-lg font-bold"
                            placeholder="••••••"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full mt-5 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 shadow-md transition disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify & Login"}
                        </button>

                        {/* Resend OTP with Circular Countdown */}
                        {timer > 0 ? (
                            <div className="flex flex-col items-center mt-4">
                                <div className="relative flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 transform -rotate-90"
                                        viewBox="0 0 40 40"
                                    >
                                        <circle
                                            cx="20"
                                            cy="20"
                                            r={circleRadius}
                                            stroke="#e5e7eb"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <circle
                                            cx="20"
                                            cy="20"
                                            r={circleRadius}
                                            stroke="#16a34a"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={circumference - progress}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-sm font-medium text-green-700">
                                        {formatTime(timer)}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">
                                    OTP valid for 5 minutes
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleGetOtp}
                                className="w-full mt-4 text-sm text-green-600 hover:underline"
                            >
                                🔄 Resend OTP
                            </button>
                        )}

                        <button
                            onClick={() => setStep(1)}
                            className="w-full mt-2 text-sm text-gray-600 hover:underline"
                        >
                            Change Mobile Number
                        </button>
                    </motion.div>
                )}

                {/* Footer / Branding */}
                <p className="text-xs text-gray-400 text-center mt-6">
                    ♻️ Eco-friendly Pickup Service
                </p>
            </motion.div>
        </div>
    );
}

export default UserLoginPage