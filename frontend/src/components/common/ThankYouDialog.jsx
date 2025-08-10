import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const ThankYouDialog = ({ isVisible, onClose }) => {
  const language = useSelector((state) => state.language.language);

  const thankYouMessages = {
    ar: "استودعتكم الله بحفظه ورعايته ولا تنسون تسيرون علينا قريب",
    en: "May Allah keep you safe. Don't forget to visit us again soon."
  };

  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 10 seconds
      const autoHideTimer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => {
        clearTimeout(autoHideTimer);
      };
    }
  }, [isVisible, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-10 text-center"
            style={{
              background: "linear-gradient(135deg, #FFF9E6 0%, #ffffff 100%)",
              border: "2px solid #D4AF37",
              minHeight: "400px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group shadow-md"
              aria-label="Close thank you dialog"
            >
              <svg
                className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Thank You Icon */}
            <div className="mb-8">
              <div className="w-74 h-74 mx-auto flex items-center justify-center">
                <img
                  src="/home/welcome.jpg"
                  alt="Thank You"
                  className="w-full h-full rounded-2xl object-contain"
                />
              </div>
            </div>

            {/* Thank You Message */}
            <div className="mb-8">
              <h2
                className="text-3xl font-bold text-[#D4AF37] mb-4"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {language === "ar" ? "شكراً لكم" : "Thank You"}
              </h2>
              <p
                className="text-gray-600 text-base leading-relaxed mb-4"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {thankYouMessages[language] || thankYouMessages.en}
              </p>
              <p
                className="text-sm text-gray-500"
                dir={language === "ar" ? "rtl" : "ltr"}
              >
                {language === "ar"
                  ? "تم تأكيد طلبكم بنجاح وسنتواصل معكم قريباً"
                  : "Your order has been confirmed successfully and we will contact you soon"
                }
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 w-3 h-3 bg-[#D4AF37] rounded-full opacity-30"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#D4AF37] rounded-full opacity-20"></div>
            <div className="absolute top-1/2 left-2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-40"></div>
            <div className="absolute top-1/3 right-2 w-2 h-2 bg-[#D4AF37] rounded-full opacity-25"></div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <motion.div
                  className="bg-[#D4AF37] h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 10, ease: "linear" }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {language === "ar"
                  ? "سيتم إغلاق هذه الرسالة تلقائياً بعد 10 ثوانٍ"
                  : "This message will close automatically in 10 seconds"
                }
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThankYouDialog;
