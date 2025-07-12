import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useVerifyUserMutation } from "../../redux/features/usersApi";
import { useSelector } from "react-redux";

// Language translations
const translations = {
  en: {
    verifyYourAccount: "Verify Your Account",
    checkEmail: "Check Your Email",
    sentCode: "We've sent a 4-digit verification code to",
    enterCode: "Enter verification code",
    verifying: "Verifying...",
    verifyAccount: "Verify Account",
    didntReceive: "Didn't receive the code?",
    resend: "Resend Code",
    backToSignup: "← Back to Sign Up",
    pleaseEnter4Digits: "Please enter all 4 digits",
    verificationSuccess: "Account verified successfully!",
    verificationFailed: "Verification failed. Please try again.",
    goToSignupToResend: "Please go back to signup to resend OTP",
  },
  ar: {
    verifyYourAccount: "تحقق من حسابك",
    checkEmail: "تحقق من بريدك الإلكتروني",
    sentCode: "لقد أرسلنا رمز تحقق مكون من 4 أرقام إلى",
    enterCode: "أدخل رمز التحقق",
    verifying: "جارٍ التحقق...",
    verifyAccount: "تحقق من الحساب",
    didntReceive: "لم يصلك الرمز؟",
    resend: "إعادة إرسال الرمز",
    backToSignup: "← العودة للتسجيل",
    pleaseEnter4Digits: "يرجى إدخال 4 أرقام",
    verificationSuccess: "تم التحقق من الحساب بنجاح!",
    verificationFailed: "فشل التحقق. حاول مرة أخرى.",
    goToSignupToResend: "يرجى العودة إلى صفحة التسجيل لإعادة إرسال الرمز",
  },
};

const VerifyOTP = () => {
  const language = useSelector((state) => state.language.language || "en");
  const t = translations[language];

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [verifyUser] = useVerifyUserMutation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem("verificationEmail");

    if (emailFromState) {
      setEmail(emailFromState);
      localStorage.setItem("verificationEmail", emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      navigate("/signup");
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
      setError(t.pleaseEnter4Digits);
      return;
    }

    setIsLoading(true);
    try {
      await verifyUser({ email, otp: otpString }).unwrap();
      localStorage.removeItem("verificationEmail");

      toast.success(t.verificationSuccess);
      navigate("/login");
    } catch (err) {
      setError(err?.data?.message || t.verificationFailed);
      toast.error(err?.data?.message || t.verificationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setError("");
    toast.info(t.goToSignupToResend);
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
          <p className="mt-2 text-gray-300 text-sm">{t.verifyYourAccount}</p>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{t.checkEmail}</h3>
            <p className="text-gray-600 text-sm">{t.sentCode}</p>
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
                {t.enterCode}
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
              {isLoading ? t.verifying : t.verifyAccount}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">{t.didntReceive}</p>
            <button
              onClick={handleResendOTP}
              className="mt-2 font-medium text-[#D4AF37] hover:text-yellow-600 border-b border-transparent hover:border-[#D4AF37] transition duration-200"
            >
              {t.resend}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/signup"
              className="font-medium text-gray-600 hover:text-gray-800 text-sm"
            >
              {t.backToSignup}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
