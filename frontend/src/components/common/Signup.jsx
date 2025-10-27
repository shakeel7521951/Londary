import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useRegisterUserMutation } from "../../redux/features/usersApi";
import { useSelector } from "react-redux";

// Language translations
const translations = {
  en: {
    createPremiumAccount: "Create your premium account",
    fullName: "Full Name",
    email: "Email Address",
    phoneNumber: "WhatsApp Phone Number",
    password: "Password",
    confirmPassword: "Confirm Password",
    placeholderName: "Enter your full name",
    placeholderEmail: "your@email.com",
    placeholderPhone: "+1234567890",
    placeholderPassword: "••••••••",
    whatsappInfo:
      "Enter your full WhatsApp number with country code (e.g., +1234567890)",
    terms: "I agree to the",
    termsLink: "terms and conditions",
    createAccount: "Create Account",
    creatingAccount: "Creating Account...",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
  },
  ar: {
    createPremiumAccount: "أنشئ حسابك المميز",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phoneNumber: "رقم الواتساب",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    placeholderName: "أدخل اسمك الكامل",
    placeholderEmail: "your@email.com",
    placeholderPhone: "+1234567890",
    placeholderPassword: "••••••••",
    whatsappInfo: "أدخل رقم الواتساب الكامل مع رمز البلد (مثال: +1234567890)",
    terms: "أوافق على",
    termsLink: "الشروط والأحكام",
    createAccount: "إنشاء حساب",
    creatingAccount: "جارٍ إنشاء الحساب...",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    signIn: "تسجيل الدخول",
  },
};

export default function Signup() {
  const language = useSelector((state) => state.language.language || "en");
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\+[1-9]\d{1,14}$/; // International phone number format with country code

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim() || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid phone number with country code (e.g., +1234567890)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      }).unwrap();

      toast.success(
        "Registration successful! Please check your email for verification code."
      );
      navigate("/verify-otp", {
        state: { email: formData.email },
      });
    } catch (err) {
      setErrors({
        submit: err?.data?.message || "Registration failed. Please try again.",
      });
      toast.error(
        err?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      id: "name",
      label: t.fullName,
      type: "text",
      placeholder: t.placeholderName,
      icon: (
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "email",
      label: t.email,
      type: "email",
      placeholder: t.placeholderEmail,
      icon: (
        <svg
          className="w-5 h-5 text-gray-400"
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
      placeholder: t.placeholderPassword,
      icon: (
        <svg
          className="w-5 h-5 text-gray-400"
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
    {
      id: "confirmPassword",
      label: t.confirmPassword,
      type: "password",
      placeholder: t.placeholderPassword,
      icon: (
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] to-[#f1ece5] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="bg-[#1C1C1C] p-6 text-center">
          <h2 className="text-2xl font-light text-[#D4AF37] tracking-wide">
            AKOYA LUXURY LAUNDRY
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <p className="mt-2 text-gray-300 text-sm">{t.createPremiumAccount}</p>
        </div>

        <div className="p-8">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {inputFields.map(({ id, label, type, placeholder, icon }) => (
              <div key={id}>
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
                    className={`block w-full pl-10 pr-4 py-3 border ${
                      errors[id] ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200`}
                  />
                </div>
                {errors[id] && (
                  <p className="mt-1 text-sm text-red-600">{errors[id]}</p>
                )}
              </div>
            ))}

            {/* Phone Number Field */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="phoneNumber"
              >
                {t.phoneNumber}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder={t.placeholderPhone}
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-4 py-3 border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phoneNumber}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">{t.whatsappInfo}</p>
            </div>

            <div className="flex items-center mt-1">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                {t.terms}{" "}
                <a href="#" className="text-[#D4AF37] hover:underline">
                  {t.termsLink}
                </a>
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#F1C232] hover:from-[#C9A227] hover:to-[#E0B82D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.creatingAccount : t.createAccount}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              {t.alreadyHaveAccount}{" "}
              <Link
                to="/login"
                className="font-medium text-[#D4AF37] hover:text-yellow-600 border-b border-transparent hover:border-[#D4AF37] transition duration-200"
              >
                {t.signIn}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
