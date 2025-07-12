import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../redux/features/authSlice";
import { toggleLanguage } from "../../redux/features/languageSlice";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      navLinks: ["Home", "Services", "About", "Contact"],
      login: "Client Login",
      bookNow: "Book Now",
      dashboard: "Dashboard",
      languageToggle: "العربية",
    },
    ar: {
      navLinks: ["الرئيسية", "الخدمات", "من نحن", "اتصل بنا"],
      login: "تسجيل الدخول",
      bookNow: "احجز الآن",
      dashboard: "لوحة التحكم",
      languageToggle: "English",
    },
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
        scrolled
          ? "bg-black/30 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className=" mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img
              src="./logo.png"
              alt="company logo"
              loading="lazy"
              className="w-20 h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {t.navLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={`/${link}`}
                className={`relative text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  scrolled
                    ? "text-white/90 hover:text-white"
                    : "text-white/80 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleLanguage())}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                scrolled
                  ? "text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                  : "text-white border border-[#D4AF37] hover:bg-[#D4AF37]/10"
              }`}
            >
              {t.languageToggle}
            </button>

            {isAuthenticated ? (
              <UserProfileDropdown user={currentUser} />
            ) : (
              <motion.a
                href="/login"
                className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  scrolled
                    ? "text-white border border-white/30 hover:bg-white/10 hover:border-white/50"
                    : "text-white border border-[#D4AF37] hover:bg-[#D4AF37]/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.login}
              </motion.a>
            )}
            <motion.a
              href="/book-now"
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
                scrolled
                  ? "text-[#1a1a1a] bg-[#D4AF37] hover:bg-[#E5C547] shadow-lg"
                  : "text-[#1a1a1a] bg-[#D4AF37] hover:bg-[#c9a227]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.bookNow}
            </motion.a>
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div
                className={`pt-4 pb-8 space-y-4 ${
                  scrolled
                    ? "bg-black/20 backdrop-blur-sm rounded-b-lg mx-2"
                    : ""
                }`}
              >
                {t.navLinks.map((link, idx) => (
                  <motion.a
                    key={idx}
                    href={`/${link}`}
                    className={`block px-3 py-3 text-white rounded-lg transition-all duration-300 ${
                      scrolled
                        ? "hover:bg-white/10 hover:backdrop-blur-sm"
                        : "hover:bg-[#D4AF37]/10"
                    }`}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {link}
                  </motion.a>
                ))}
                <div className="pt-4 mt-4 border-t border-[#D4AF37]/20 space-y-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="px-3 py-3 text-white">
                        <div className="flex items-center space-x-3">
                          {currentUser?.profilePic ? (
                            <img
                              src={currentUser.profilePic}
                              alt={currentUser.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-[#D4AF37]"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1a1a1a] font-medium text-sm">
                              {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">
                              {currentUser?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-300">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      {currentUser?.role === "admin" && (
                        <motion.a
                          href="/dashboard"
                          className="block px-3 py-3 text-center text-white border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {t.dashboard}
                        </motion.a>
                      )}
                    </div>
                  ) : (
                    <motion.a
                      href="/login"
                      className="block px-3 py-3 text-center text-white border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      {t.login}
                    </motion.a>
                  )}
                  <motion.a
                    href="/book-now"
                    className="block px-3 py-3 text-center text-[#1a1a1a] bg-[#D4AF37] rounded-lg hover:bg-[#c9a227] transition-colors"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    {t.bookNow}
                  </motion.a>

                  <motion.button
                    onClick={() => dispatch(toggleLanguage())}
                    className="block w-full px-3 py-3 text-center text-white border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {t.languageToggle}
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
