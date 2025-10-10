import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiGlobe } from "react-icons/fi";
import { toggleLanguage as toggleReduxLanguage } from "../../redux/features/languageSlice";

const LanguageSwitcher = ({ isCollapsed }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state) => state.language.language);

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "ar" : "en";

    // Update Redux state (this also updates localStorage)
    dispatch(toggleReduxLanguage());

    // Update i18next
    i18n.changeLanguage(newLang);

    // Update document direction for RTL/LTR
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  if (isCollapsed) {
    return (
      <motion.button
        onClick={toggleLanguage}
        className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-colors text-[#D4AF37] hover:text-white w-full flex justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={t("language")}
      >
        <FiGlobe size={20} />
      </motion.button>
    );
  }

  return (
    <motion.div
      className="px-3 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-xs font-medium">
          {t("language")}
        </span>
        <FiGlobe className="text-[#D4AF37]" size={16} />
      </div>
      <motion.button
        onClick={toggleLanguage}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-white text-sm font-medium">
          {i18n.language === "en" ? "English" : "العربية"}
        </span>
        <motion.div
          className="w-2 h-2 bg-[#D4AF37] rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    </motion.div>
  );
};

export default LanguageSwitcher;
