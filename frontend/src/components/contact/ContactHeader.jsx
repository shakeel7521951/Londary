import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ContactSlider = () => {
  const language = useSelector((state) => state.language.language);

  const slides = [
    {
      id: 1,
      title: {
        en: "Contact Akoya Laundry",
        ar: "اتصل بغسيل أكويا",
      },
      subtitle: {
        en: "Luxury laundry services tailored to your needs in Doha, Qatar",
        ar: "خدمات غسيل فاخرة مصممة حسب احتياجاتك في الدوحة، قطر",
      },
      bgImage: "/home/exectiveCollection.jpg",
    },
    {
      id: 2,
      title: {
        en: "Professional Care",
        ar: "رعاية احترافية",
      },
      subtitle: {
        en: "Expert fabric handling with eco-friendly detergents",
        ar: "معالجة أقمشة احترافية باستخدام منظفات صديقة للبيئة",
      },
      bgImage: "/home/platinumCare.jpg",
    },
    {
      id: 3,
      title: {
        en: "Express Service",
        ar: "خدمة سريعة",
      },
      subtitle: {
        en: "Quick turnaround without compromising quality",
        ar: "تسليم سريع دون المساومة على الجودة",
      },
      bgImage: "/home/eco.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className={`relative bg-[#1C1C1C] text-white overflow-hidden h-96 min-h-[530px] flex items-center ${
        language === "ar" ? "rtl text-right" : ""
      }`}
    >
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-[#D4AF37] scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `url(${slides[currentIndex].bgImage})`,
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
            {slides[currentIndex].title[language] ||
              slides[currentIndex].title.en}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#D4AF37]">
            {slides[currentIndex].subtitle[language] ||
              slides[currentIndex].subtitle.en}
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 h-px bg-[#D4AF37] w-32 mx-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ContactSlider;
