import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const GuestInfoModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const language = useSelector((state) => state.language.language);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const translations = {
    en: {
      title: "Guest Order Information",
      subtitle: "Please provide your contact details to place the order",
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email Address (Optional)",
      emailPlaceholder: "your@email.com (optional)",
      phoneLabel: "WhatsApp Number",
      phonePlaceholder: "+974XXXXXXXX (with country code)",
      addressLabel: "Delivery Address",
      addressPlaceholder: "Enter your delivery address",
      submit: "Proceed with Order",
      submitting: "Processing...",
      cancel: "Cancel",
      required: "This field is required",
      invalidEmail: "Please enter a valid email address",
      invalidPhone:
        "Phone number must include country code (e.g., +974XXXXXXXX)",
      loginOption: "Already have an account?",
      loginLink: "Login here",
    },
    ar: {
      title: "معلومات طلب الضيف",
      subtitle: "يرجى تقديم تفاصيل الاتصال الخاصة بك لتقديم الطلب",
      nameLabel: "الاسم الكامل",
      namePlaceholder: "أدخل اسمك الكامل",
      emailLabel: "عنوان البريد الإلكتروني (اختياري)",
      emailPlaceholder: "your@email.com (اختياري)",
      phoneLabel: "رقم الواتساب",
      phonePlaceholder: "+974XXXXXXXX (مع رمز الدولة)",
      addressLabel: "عنوان التسليم",
      addressPlaceholder: "أدخل عنوان التسليم الخاص بك",
      submit: "المتابعة مع الطلب",
      submitting: "جاري المعالجة...",
      cancel: "إلغاء",
      required: "هذا الحقل مطلوب",
      invalidEmail: "يرجى إدخال عنوان بريد إلكتروني صالح",
      invalidPhone: "يجب أن يتضمن رقم الهاتف رمز الدولة (مثال: +974XXXXXXXX)",
      loginOption: "هل لديك حساب بالفعل؟",
      loginLink: "تسجيل الدخول هنا",
    },
  };

  const t = translations[language] || translations.en;

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    // Email validation (optional - only validate format if provided)
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = t.invalidEmail;
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t.required;
    } else if (!/^\+[1-9]\d{1,14}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = t.invalidPhone;
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = t.required;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal - Compact Design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            style={{
              maxHeight: "85vh",
            }}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c9a227]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            {/* Header - Compact */}
            <div className="relative bg-gradient-to-r from-[#2C2416] via-[#4A3B2A] to-[#6B5B47] text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{t.title}</h2>
                    <p className="text-xs text-gray-300">{t.subtitle}</p>
                  </div>
                </div>
                {!isSubmitting && (
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
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
                )}
              </div>
            </div>

            {/* Form - Compact with hidden scrollbar */}
            <div
              className="relative px-6 py-5 overflow-y-auto"
              style={{
                maxHeight: "calc(85vh - 140px)",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
              }}
            >
              {/* Hide scrollbar for Chrome/Safari/Opera */}
              <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email - Grid Layout for compact design */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.namePlaceholder}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.emailPlaceholder}
                      className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500 bg-red-50"
                          : "border-gray-200 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone Field - Full Width */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {t.phoneLabel} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder={t.phonePlaceholder}
                    className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.phoneNumber
                        ? "border-red-500 focus:ring-red-500 bg-red-50"
                        : "border-gray-200 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white"
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Address Field - Compact */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {t.addressLabel} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t.addressPlaceholder}
                    rows="2"
                    className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.address
                        ? "border-red-500 focus:ring-red-500 bg-red-50"
                        : "border-gray-200 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white"
                    }`}
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    disabled={isSubmitting}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Action Buttons - Compact */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-[#D4AF37] to-[#c9a227] text-white rounded-xl hover:from-[#c9a227] hover:to-[#b8941f] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t.submitting}
                      </span>
                    ) : (
                      t.submit
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuestInfoModal;
