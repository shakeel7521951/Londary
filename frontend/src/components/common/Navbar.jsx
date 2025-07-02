import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      className={`fixed w-full z-50 transition-colors duration-300 ${scrolled ? "bg-[#1a1a1a] shadow-lg" : "bg-transparent"}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a 
            href="#" 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-2xl font-light tracking-wider text-white">AKOYA</span>
          </motion.a>

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
            <motion.a
              href="#"
              className="px-6 py-2.5 text-sm font-medium text-white border border-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Client Login
            </motion.a>
            <motion.a
              href="#"
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
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
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
                  <motion.a
                    href="#"
                    className="block px-3 py-3 text-center text-white border border-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/10 transition-colors"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    Client Login
                  </motion.a>
                  <motion.a
                    href="#"
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