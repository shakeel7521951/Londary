import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../redux/features/authSlice";
import { toggleLanguage } from "../../redux/features/languageSlice";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const language = useSelector((state) => state.language.language);

  // Check if current page needs dark navbar
  const isDarkNavbarPage =
    location.pathname === "/terms" || location.pathname === "/vision-mission";

  // Function to handle language toggle with proper sync
  const handleLanguageToggle = () => {
    const newLanguage = language === "en" ? "ar" : "en";

    // Update Redux state (this also updates localStorage)
    dispatch(toggleLanguage());

    // Update i18next
    i18n.changeLanguage(newLanguage);

    // Update document direction for RTL/LTR
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  const translations = {
    en: {
      navLinks: ["Home", "Services", "About", "Vision & Mission", "Contact"],
      login: "Client Login",
      bookNow: "Book Now",
      dashboard: "Dashboard",
      languageToggle: "العربية",
    },
    ar: {
      navLinks: [
        "الرئيسية",
        "الخدمات",
        "من نحن",
        "الرؤية والرسالة",
        "اتصل بنا",
      ],
      login: "تسجيل الدخول",
      bookNow: "احجز الآن",
      dashboard: "لوحة التحكم",
      languageToggle: "English",
    },
  };

  // Arabic nav label to route mapping
  const arNavLinkRoutes = {
    الرئيسية: "/home",
    الخدمات: "/services",
    "من نحن": "/about",
    "الرؤية والرسالة": "/vision-mission",
    "اتصل بنا": "/contact",
  };

  const getNavLinkPath = (label) => {
    if (language === "ar") {
      return arNavLinkRoutes[label] || "/";
    }

    // Handle special cases for English labels
    switch (label) {
      case "Vision & Mission":
        return "/vision-mission";
      case "Home":
        return "/home";
      case "Services":
        return "/services";
      case "About":
        return "/about";
      case "Contact":
        return "/contact";
      default:
        return "/";
    }
  };

  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out max-w-[1440px] ${
        isDarkNavbarPage
          ? "bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-xl"
          : scrolled
          ? "bg-black/30 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="inline-block">
            <img
              src="./companylogo.png"
              alt="company logo"
              loading="lazy"
              className="w-24 h-10 block m-0 p-0"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {t.navLinks.map((label, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link
                  to={getNavLinkPath(label)}
                  className={`text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                    isDarkNavbarPage
                      ? "text-white/90 hover:text-white"
                      : scrolled
                      ? "text-white/90 hover:text-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={handleLanguageToggle}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                isDarkNavbarPage
                  ? "text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                  : scrolled
                  ? "text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                  : "text-white border border-[#D4AF37] hover:bg-[#D4AF37]/10"
              }`}
            >
              {t.languageToggle}
            </button>

            {isAuthenticated ? (
              <UserProfileDropdown user={currentUser} />
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    scrolled
                      ? "text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                      : "text-white border border-[#D4AF37] hover:bg-[#D4AF37]/10"
                  }`}
                >
                  {t.login}
                </Link>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/book-now"
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  scrolled
                    ? "text-[#1a1a1a] bg-[#D4AF37] hover:bg-[#E5C547] shadow-lg"
                    : "text-[#1a1a1a] bg-[#D4AF37] hover:bg-[#c9a227]"
                }`}
              >
                {t.bookNow}
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div
                className={`mt-4 mx-2 rounded-2xl border backdrop-blur-xl shadow-2xl ${
                  isDarkNavbarPage
                    ? "bg-gray-800/90 border-gray-600/30 shadow-black/50"
                    : scrolled
                    ? "bg-black/40 border-white/10 shadow-black/50"
                    : "bg-black/60 border-[#D4AF37]/20 shadow-black/60"
                }`}
              >
                {/* Navigation Links */}
                <div className="p-6 space-y-2">
                  {t.navLinks.map((label, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <Link
                        to={getNavLinkPath(label)}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-4 py-3.5 text-white rounded-xl transition-all duration-300 group relative overflow-hidden ${
                          isDarkNavbarPage
                            ? "hover:bg-white/10 hover:shadow-lg active:bg-white/20"
                            : scrolled
                            ? "hover:bg-white/10 hover:shadow-lg active:bg-white/20"
                            : "hover:bg-[#D4AF37]/10 hover:shadow-lg active:bg-[#D4AF37]/20"
                        }`}
                      >
                        <span className="relative z-10 font-medium text-base">
                          {label}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.span
                          className="ml-auto text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ x: 5 }}
                        >
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>

                {/* Action Buttons */}
                <div className="p-6 space-y-3">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      {/* User Profile */}
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl border border-[#D4AF37]/20"
                      >
                        <div className="flex items-center space-x-3">
                          {currentUser?.profilePic ? (
                            <img
                              src={currentUser.profilePic}
                              alt={currentUser.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-[#1a1a1a] font-bold text-base shadow-lg">
                              {currentUser?.name?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm truncate">
                              {currentUser?.name || "User"}
                            </p>
                            <p className="text-gray-300 text-xs truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Dashboard Link for Admin */}
                      {currentUser?.role === "admin" && (
                        <motion.div
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          <Link
                            to="/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center px-4 py-3.5 text-white border-2 border-[#D4AF37]/50 rounded-xl hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 font-medium"
                          >
                            <span>{t.dashboard}</span>
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center px-4 py-3.5 text-white border-2 border-[#D4AF37]/50 rounded-xl hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 font-medium"
                      >
                        <span>{t.login}</span>
                      </Link>
                    </motion.div>
                  )}

                  {/* Book Now Button */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Link
                      to="/book-now"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center px-4 py-4 text-[#1a1a1a] bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-xl hover:from-[#F4D03F] hover:to-[#D4AF37] transition-all duration-300 font-bold text-base shadow-xl shadow-[#D4AF37]/30 transform hover:scale-105 active:scale-95"
                    >
                      <span>{t.bookNow}</span>
                    </Link>
                  </motion.div>

                  {/* Language Toggle */}
                  <motion.button
                    onClick={() => {
                      handleLanguageToggle();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3.5 text-white border-2 border-[#D4AF37]/50 rounded-xl hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 font-medium"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{t.languageToggle}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
