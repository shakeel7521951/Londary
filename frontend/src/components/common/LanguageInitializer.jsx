import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../redux/features/languageSlice";

const LanguageInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const currentLanguage = useSelector((state) => state.language.language);

  useEffect(() => {
    // Get saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage");

    if (savedLanguage && savedLanguage !== currentLanguage) {
      // If there's a saved language different from Redux state, sync them
      dispatch(setLanguage(savedLanguage));
      i18n.changeLanguage(savedLanguage);
    } else if (currentLanguage) {
      // If Redux has a language, sync i18next with it
      i18n.changeLanguage(currentLanguage);
    }

    // Set initial document direction and language
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage || "en";
  }, [currentLanguage, dispatch, i18n]);

  // Sync document properties whenever language changes
  useEffect(() => {
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return children;
};

export default LanguageInitializer;
