// pages/WelcomePage.jsx
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/logo4.png";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm text-center flex flex-col items-center space-y-6">
        {/* Logo / Icon */}
        <div className="text-5xl">
            <img
                src={logo}
                alt="ScrapDeal Logo"
                className="w-50"
            // style={{
            //   height: 80,
            //   maxWidth: "400px",
            //   // objectFit: "contain",
            // }}
            />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Welcome to Wasteology
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-gray-500">
          Choose how you want to log in
        </p>

        {/* Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => navigate("/login/admin")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-blue-700 transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Login as Admin
          </button>
          <button
            onClick={() => navigate("/login/customer")}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-green-700 transition focus-visible:outline focus-visible:ring-2 focus-visible:ring-green-400"
          >
            Login as User
          </button>
        </div>

        {/* Footer */}
        <footer className="text-xs text-gray-400 pt-4">
          © {new Date().getFullYear()} Wasteology Portal
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;
