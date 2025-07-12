import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useResetPasswordMutation } from "../../redux/features/usersApi";
import { useSelector } from "react-redux";

const translations = {
  en: {
    setNewPassword: "Set New Password",
    createNewPassword: "Create New Password",
    enterNewPassword: "Enter a new password for your account",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    resettingPassword: "Resetting Password...",
    resetPassword: "Reset Password",
    backToSignIn: "← Back to Sign In",
    passwordShort: "Password must be at least 6 characters long",
    passwordMismatch: "Passwords do not match",
    resetSuccess: "Password reset successfully!",
    resetFail: "Failed to reset password. Please try again.",
  },
  ar: {
    setNewPassword: "تعيين كلمة مرور جديدة",
    createNewPassword: "إنشاء كلمة مرور جديدة",
    enterNewPassword: "أدخل كلمة مرور جديدة لحسابك",
    newPassword: "كلمة المرور الجديدة",
    confirmNewPassword: "تأكيد كلمة المرور الجديدة",
    resettingPassword: "جارٍ إعادة تعيين كلمة المرور...",
    resetPassword: "إعادة تعيين كلمة المرور",
    backToSignIn: "← العودة إلى تسجيل الدخول",
    passwordShort: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
    passwordMismatch: "كلمات المرور غير متطابقة",
    resetSuccess: "تمت إعادة تعيين كلمة المرور بنجاح!",
    resetFail: "فشل في إعادة تعيين كلمة المرور. حاول مرة أخرى.",
  },
};

const ResetPasswordNew = () => {
  const language = useSelector((state) => state.language.language || "en");
  const t = translations[language];

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const verified = location.state?.verified;
    const emailFromStorage = localStorage.getItem("resetPasswordEmail");

    if (emailFromState && verified) {
      setEmail(emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return t.passwordShort;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        email,
        password: formData.password,
      }).unwrap();

      localStorage.removeItem("resetPasswordEmail");

      toast.success(t.resetSuccess);
      navigate("/login");
    } catch (err) {
      setError(err?.data?.message || t.resetFail);
      toast.error(err?.data?.message || t.resetFail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] to-[#f1ece5] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="bg-[#1C1C1C] p-6 text-center">
          <h2 className="text-2xl font-light text-[#D4AF37] tracking-wide">
            AKOYA PREMIUM LAUNDRY
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <p className="mt-2 text-gray-300 text-sm">{t.setNewPassword}</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-[#D4AF37]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t.createNewPassword}
            </h3>
            <p className="text-gray-600 text-sm">{t.enterNewPassword}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                {t.newPassword}
              </label>
              <div className="relative">
                {/* input + icon + toggle */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                {t.confirmNewPassword}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#F1C232] hover:from-[#C9A227] hover:to-[#E0B82D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.resettingPassword : t.resetPassword}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-gray-600 hover:text-gray-800 text-sm">
              {t.backToSignIn}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordNew;
