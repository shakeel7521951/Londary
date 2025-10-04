import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: [
      {
        image: "./home/platinumCare.jpg",
        title: "Premium Garment Care",
        description: "Expert cleaning for your most delicate fabrics",
      },
      {
        image: "./home/eco.jpg",
        title: "Eco-Conscious Cleaning",
        description: "Sustainable methods without compromising quality",
      },
      {
        image: "./home/pressing.jpg",
        title: "Precision Pressing",
        description: "Impeccable finishes for business and formalwear",
      },
    ],
    ar: [
      {
        image: "./home/platinumCare.jpg",
        title: "رعاية متميزة للملابس",
        description: "تنظيف احترافي لأقمشتك الحساسة",
      },
      {
        image: "./home/eco.jpg",
        title: "تنظيف صديق للبيئة",
        description: "طرق مستدامة دون المساس بالجودة",
      },
      {
        image: "./home/pressing.jpg",
        title: "كي دقيق",
        description: "تشطيبات مثالية للملابس الرسمية",
      },
    ],
  };

  const slides = translations[language];

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="relative w-full h-[80vh] min-h-[560px] max-h-[600px] overflow-hidden">
      {/* Slides */}
      <div
        className="h-full w-full flex transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/80 via-[#1C1C1C]/40 to-[#1C1C1C]/10"></div>
            </div>

            {/* Content */}
            <motion.div
              className={`absolute inset-0 flex flex-col justify-center ${
                language === "ar"
                  ? "items-end text-right"
                  : "items-start text-left"
              } px-8 md:px-16 lg:px-24`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 max-w-2xl"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.title}
              </motion.h2>
              <motion.p
                className="text-xl md:text-2xl text-[#D4AF37] mb-8 max-w-xl"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {slide.description}
              </motion.p>
              <Link to="/book-now">
                <motion.button
                  className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === "ar" ? "جدولة الاستلام" : "Schedule Pickup"}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - only show after video */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#1C1C1C]/50 hover:bg-[#1C1C1C]/80 text-[#D4AF37] p-3 rounded-full backdrop-blur-sm transition duration-300 z-10"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1C1C1C]/50 hover:bg-[#1C1C1C]/80 text-[#D4AF37] p-3 rounded-full backdrop-blur-sm transition duration-300 z-10"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Indicator - only show after video */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-[#D4AF37] w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Overlay pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
    </div>
  );
};

export default Header;
