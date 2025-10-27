import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForgotPasswordOTPMutation } from "../../redux/features/usersApi";
import { useSelector } from "react-redux";

// Language translations
const translations = {
  en: {
    resetPassword: "Reset Your Password",
    forgotPassword: "Forgot Password?",
    enterEmailPrompt:
      "Enter your email address and we'll send you a verification code to reset your password.",
    emailSent: "Email Sent Successfully",
    checkYourEmail: "Check Your Email",
    codeSentTo: "We've sent a verification code to",
    redirecting: "Redirecting to verification page...",
    emailLabel: "Email Address",
    emailPlaceholder: "your@email.com",
    sendResetCode: "Send Reset Code",
    sending: "Sending...",
    backToSignIn: "Back to Sign In",
    rememberPassword: "Remember your password?",
    pleaseEnterEmail: "Please enter your email address",
    invalidEmail: "Please enter a valid email address",
    sendFailed: "Failed to send reset email. Please try again.",
  },
  ar: {
    resetPassword: "إعادة تعيين كلمة المرور",
    forgotPassword: "هل نسيت كلمة المرور؟",
    enterEmailPrompt:
      "أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور.",
    emailSent: "تم إرسال البريد الإلكتروني بنجاح",
    checkYourEmail: "تحقق من بريدك الإلكتروني",
    codeSentTo: "لقد أرسلنا رمز تحقق إلى",
    redirecting: "جاري التوجيه إلى صفحة التحقق...",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "example@email.com",
    sendResetCode: "إرسال رمز التحقق",
    sending: "جاري الإرسال...",
    backToSignIn: "العودة لتسجيل الدخول",
    rememberPassword: "هل تذكرت كلمة المرور؟",
    pleaseEnterEmail: "يرجى إدخال بريدك الإلكتروني",
    invalidEmail: "يرجى إدخال بريد إلكتروني صالح",
    sendFailed: "فشل في إرسال البريد الإلكتروني. حاول مرة أخرى.",
  },
};

const ForgotPassword = () => {
  const language = useSelector((state) => state.language.language || "en");
  const t = translations[language];

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const navigate = useNavigate();
  const [forgotPasswordOTP] = useForgotPasswordOTPMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t.pleaseEnterEmail);
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError(t.invalidEmail);
      return;
    }

    setIsLoading(true);
    try {
      await forgotPasswordOTP(email).unwrap();

      setIsEmailSent(true);
      localStorage.setItem("resetPasswordEmail", email);

      setTimeout(() => {
        navigate("/reset-password-verify", {
          state: { email, fromForgotPassword: true },
        });
      }, 2000);
    } catch (err) {
      setError(err?.data?.message || t.sendFailed);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] to-[#f1ece5] flex items-center justify-center p-4">
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
            <p className="mt-2 text-gray-300 text-sm">{t.emailSent}</p>
          </div>

          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t.checkYourEmail}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {t.codeSentTo} <strong>{email}</strong>
            </p>
            <p className="text-gray-500 text-xs">{t.redirecting}</p>
          </div>
        </motion.div>
      </div>
    );
  }

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
            AKOYA LUXURY LAUNDRY
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <p className="mt-2 text-gray-300 text-sm">{t.resetPassword}</p>
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t.forgotPassword}
            </h3>
            <p className="text-gray-600 text-sm">{t.enterEmailPrompt}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                {t.emailLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#F1C232] hover:from-[#C9A227] hover:to-[#E0B82D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.sending : t.sendResetCode}
            </motion.button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t.rememberPassword}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-[#D4AF37] hover:text-yellow-600 border-b border-transparent hover:border-[#D4AF37] transition duration-200"
              >
                {t.backToSignIn}
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
