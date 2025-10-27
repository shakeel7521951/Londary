import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../../redux/features/usersApi";
import { setCredentials } from "../../redux/features/authSlice";

// Translations for English and Arabic
const translations = {
  en: {
    signInToAccount: "Sign in to your account",
    email: "Email Address",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signIn: "Sign in",
    signingIn: "Signing in...",
    newToAkoya: "New to AKOYA?",
    createAccount: "Create your account",
  },
  ar: {
    signInToAccount: "تسجيل الدخول إلى حسابك",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "هل نسيت كلمة المرور؟",
    signIn: "تسجيل الدخول",
    signingIn: "جاري تسجيل الدخول...",
    newToAkoya: "جديد على AKOYA؟",
    createAccount: "أنشئ حسابك",
  },
};

const Login = () => {
  const language = useSelector((state) => state.language.language || "en");
  const t = translations[language];

  const inputFields = [
    {
      id: "email",
      label: t.email,
      type: "email",
      placeholder: "your@email.com",
      icon: (
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "password",
      label: t.password,
      type: "password",
      placeholder: "••••••••",
      icon: (
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser] = useLoginUserMutation();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || e.target.name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      console.log("🔐 Login result:", result);
      console.log("🔐 Token received:", result.token);

      // Save token to localStorage as backup
      if (result.token) {
        localStorage.setItem("token", result.token);
        console.log("✅ Token saved to localStorage");
      } else {
        console.warn("⚠️ No token in login response!");
      }

      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
        })
      );

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err?.data?.message || "Login failed. Please try again.");
      toast.error(err?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] to-[#f1ece5] flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-[#1C1C1C] p-6 text-center">
          <h2 className="text-2xl font-light text-[#D4AF37] tracking-wide">
            AKOYA LUXURY LAUNDRY
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <p className="mt-2 text-gray-300 text-sm">{t.signInToAccount}</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {inputFields.map(({ id, label, type, placeholder, icon }) => (
              <div className="mb-6" key={id}>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor={id}
                >
                  {label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                  </div>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={formData[id]}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200"
                    required
                  />
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  {t.rememberMe}
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[#D4AF37] hover:text-yellow-600"
                >
                  {t.forgotPassword}
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#F1C232] hover:from-[#C9A227] hover:to-[#E0B82D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.signingIn : t.signIn}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t.newToAkoya}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/signup"
                className="font-medium text-[#D4AF37] hover:text-yellow-600 border-b border-transparent hover:border-[#D4AF37] transition duration-200"
              >
                {t.createAccount}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
