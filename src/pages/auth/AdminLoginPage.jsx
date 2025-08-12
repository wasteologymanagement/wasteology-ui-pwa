import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { loginApi } from "../../service/apiServices/loginService";
import { saveTokens } from "../../utils/tokensUtils";
import { loginSuccess } from "../../store/slice/userSlice";
import { ROLES } from "../../utils/roleConstants";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "error" });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (alert.show) setAlert({ ...alert, show: false });
  };

  const handleRoleRedirect = (role) => {
    if (role === ROLES.ADMIN) return navigate("/app/admin/dashboard");
    if (role === ROLES.PICKER) return navigate("/app/picker/dashboard");
    throw new Error("Unauthorized user role");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      return setAlert({ show: true, message: "Both fields are required." });
    }

    setLoading(true);
    try {
      const response = await loginApi({ email: username, password });

      console.log('response : ', response);

      if (!response?.access_token || !response?.refresh_token) {
        throw new Error("Invalid response from server");
      }

      saveTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });

      dispatch(loginSuccess({ role: response.role, ...response }));
      handleRoleRedirect(response.role);
    } catch (err) {
      setAlert({
        show: true,
        message: err?.message || "Login failed. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl">
            <i className="fas fa-user-shield" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-sm text-gray-500">Use your credentials to sign in</p>
        </div>

        {alert.show && (
          <div className={`mb-4 px-4 py-3 rounded text-sm ${alert.type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 inset-y-0 flex items-center text-gray-500"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
