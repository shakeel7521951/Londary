import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useVerifyOTPMutation } from "../../redux/features/usersApi";
import { useSelector } from "react-redux";

// Language dictionary
const translations = {
  en: {
    verifyResetCode: "Verify Reset Code",
    enterVerificationCode: "Enter Verification Code",
    codeSentTo: "We've sent a 4-digit code to",
    enterCodeLabel: "Enter verification code",
    verifying: "Verifying...",
    verifyCode: "Verify Code",
    noCode: "Didn't receive the code?",
    resend: "Resend Code",
    backToSignIn: "← Back to Sign In",
    incompleteOTP: "Please enter all 4 digits",
    invalidOTP: "Invalid or expired OTP. Please try again.",
  },
  ar: {
    verifyResetCode: "التحقق من رمز إعادة التعيين",
    enterVerificationCode: "أدخل رمز التحقق",
    codeSentTo: "لقد أرسلنا رمزًا مكونًا من 4 أرقام إلى",
    enterCodeLabel: "أدخل رمز التحقق",
    verifying: "جارٍ التحقق...",
    verifyCode: "تحقق من الرمز",
    noCode: "لم تستلم الرمز؟",
    resend: "إعادة الإرسال",
    backToSignIn: "← الرجوع لتسجيل الدخول",
    incompleteOTP: "يرجى إدخال جميع الأرقام الأربعة",
    invalidOTP: "رمز التحقق غير صالح أو منتهي الصلاحية. حاول مرة أخرى.",
  },
};

const ResetPasswordVerify = () => {
  const language = useSelector((state) => state.language.language || "en");
  const t = translations[language];

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [verifyOTP] = useVerifyOTPMutation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("resetPasswordEmail");

    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem("resetPasswordEmail", emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setError(t.incompleteOTP);
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP({
        email,
        otp: otpString,
      }).unwrap();

      navigate("/reset-password-new", {
        state: { email, verified: true },
      });
    } catch (err) {
      setError(err?.data?.message || t.invalidOTP);
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
        <div className="bg-[#1C1C1C] p-6 text-center">
          <h2 className="text-2xl font-light text-[#D4AF37] tracking-wide">
            AKOYA PREMIUM LAUNDRY
          </h2>
          <div className="mt-2 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
          <p className="mt-2 text-gray-300 text-sm">{t.verifyResetCode}</p>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t.enterVerificationCode}
            </h3>
            <p className="text-gray-600 text-sm">{t.codeSentTo}</p>
            <p className="text-[#D4AF37] font-medium text-sm">{email}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                {t.enterCodeLabel}
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition duration-200"
                    required
                  />
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#D4AF37] to-[#F1C232] hover:from-[#C9A227] hover:to-[#E0B82D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.verifying : t.verifyCode}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">{t.noCode}</p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="mt-2 font-medium text-[#D4AF37] hover:text-yellow-600 border-b border-transparent hover:border-[#D4AF37] transition duration-200"
            >
              {t.resend}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-gray-600 hover:text-gray-800 text-sm"
            >
              {t.backToSignIn}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordVerify;
