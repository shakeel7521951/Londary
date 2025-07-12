import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeaderSlides = () => {
  const language = useSelector((state) => state.language.language);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Header Slides
  const headerSlides = [
    {
      image: "./home/eco.jpg",
      title: {
        en: "Premium Garment Care",
        ar: "رعاية فاخرة للملابس",
      },
      subtitle: {
        en: "Experience the Akoya difference",
        ar: "اختبر الفرق مع أكويا",
      },
    },
    {
      image: "./home/pCollection.jpg",
      title: {
        en: "Luxury Laundry Services",
        ar: "خدمات غسيل فاخرة",
      },
      subtitle: {
        en: "For the most discerning clients",
        ar: "للعملاء الأكثر تميزًا",
      },
    },
    {
      image: "./home/expert.jpg",
      title: {
        en: "Precision Fabric Care",
        ar: "عناية دقيقة بالأقمشة",
      },
      subtitle: {
        en: "Tailored to your garment's needs",
        ar: "مصممة خصيصًا لاحتياجات ملابسك",
      },
    },
  ];

  const buttonLabel = {
    en: "Book a Collection",
    ar: "احجز موعد الاستلام",
  };

  // Auto-rotate header slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % headerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Luxury Header Section */}
      <div className="relative w-full h-[70vh] min-h-[560px] max-h-[600px] overflow-hidden">
        {/* Background Slides */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {headerSlides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full h-full relative"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/80 via-[#1C1C1C]/40 to-[#1C1C1C]/10"></div>
            </div>
          ))}
        </div>

        {/* Header Content */}
        <motion.div
          className={`absolute inset-0 flex flex-col justify-center items-center text-center px-8 ${
            language === "ar" ? "rtl" : ""
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-light text-white mb-4"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {headerSlides[currentSlide].title[language]}
          </motion.h1>
          <motion.div
            className="flex items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-xl text-[#D4AF37] tracking-widest">
              {headerSlides[currentSlide].subtitle[language]}
            </p>
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
          </motion.div>
          <Link to="/book-now">
            <motion.button
              className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-8 py-3 rounded-full text-lg font-medium"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {buttonLabel[language]}
            </motion.button>
          </Link>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {headerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-[#D4AF37] w-6" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scrolling Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default HeaderSlides;
