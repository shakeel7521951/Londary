import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../redux/features/authSlice";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Get authentication state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  const navLinks = ["Home", "Services", "About", "Contact"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#1a1a1a] shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
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
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href={link}
                className="relative text-white/80 hover:text-white text-sm font-medium uppercase tracking-wider transition-colors"
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
            {isAuthenticated ? (
              <UserProfileDropdown user={currentUser} />
            ) : (
              <motion.a
                href="/login"
                className="px-6 py-2.5 text-sm font-medium text-white border border-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Client Login
              </motion.a>
            )}
            <motion.a
              href="/book-now"
              className="px-6 py-2.5 text-sm font-medium text-[#1a1a1a] bg-[#D4AF37] rounded-full hover:bg-[#c9a227] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
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
              <div className="pt-4 pb-8 space-y-4">
                {navLinks.map((link) => (
                  <motion.a
                    key={link}
                    href="#"
                    className="block px-3 py-3 text-white hover:bg-[#D4AF37]/10 rounded-lg transition-colors"
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
                              {currentUser?.name?.charAt(0)?.toUpperCase() ||
                                "U"}
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
                      <motion.a
                        href="/dashboard"
                        className="block px-3 py-3 text-center text-white border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        Dashboard
                      </motion.a>
                    </div>
                  ) : (
                    <motion.a
                      href="/login"
                      className="block px-3 py-3 text-center text-white border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      Client Login
                    </motion.a>
                  )}
                  <motion.a
                    href="/book-now"
                    className="block px-3 py-3 text-center text-[#1a1a1a] bg-[#D4AF37] rounded-lg hover:bg-[#c9a227] transition-colors"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    Book Now
                  </motion.a>
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
