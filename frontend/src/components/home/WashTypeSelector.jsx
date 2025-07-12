import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const WashTypeSelector = () => {
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      heading: "How Would You Like It Washed?",
      subheading: "Choose your experience",
      standard: {
        title: "Standard Wash",
        desc: "Our signature 48-hour service with gentle cleaning, eco-friendly detergents, and basic folding.",
        price: "From 50 QAR",
      },
      express: {
        title: "Express Wash",
        desc: "Need it fast? Get 24-hour turnaround, priority processing, and premium care.",
        price: "From 80 QAR",
      },
      button: "Continue to Garment Selection",
    },
    ar: {
      heading: "كيف تود غسيل ملابسك؟",
      subheading: "اختر تجربتك",
      standard: {
        title: "غسيل عادي",
        desc: "خدمتنا المميزة خلال ٤٨ ساعة بالتنظيف اللطيف والمنظفات البيئية والطي الأساسي.",
        price: "ابتداءً من ٥٠ ريال",
      },
      express: {
        title: "غسيل سريع",
        desc: "تحتاجها بسرعة؟ خدمة خلال ٢٤ ساعة مع معالجة ذات أولوية ورعاية مميزة.",
        price: "ابتداءً من ٨٠ ريال",
      },
      button: "الاستمرار لاختيار الملابس",
    },
  };

  const t = translations[language];

  return (
    <section className="bg-white py-12 px-6 md:px-20 overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute w-60 h-60 bg-[#D4AF37] rounded-full blur-3xl top-20 left-10"></div>
        <div className="absolute w-80 h-80 bg-[#1C1C1C] rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-center mb-16 ${language === "ar" ? "rtl" : ""}`}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] mb-4">
          {t.heading}
        </h2>
        <p className="text-[#D4AF37] font-semibold text-lg tracking-wide uppercase">
          {t.subheading}
        </p>
      </motion.div>

      {/* Options */}
      <div className={`grid md:grid-cols-2 gap-12 ${language === "ar" ? "rtl text-right" : ""}`}>
        {/* Standard Wash */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#F5E1DA] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300"
        >
          <div className="text-5xl mb-4">🧼</div>
          <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">{t.standard.title}</h3>
          <p className="text-[#2C2C2C] mb-4">{t.standard.desc}</p>
          <div className="text-[#D4AF37] font-medium text-lg">{t.standard.price}</div>
        </motion.div>

        {/* Express Wash */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#F5E1DA] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300"
        >
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">{t.express.title}</h3>
          <p className="text-[#2C2C2C] mb-4">{t.express.desc}</p>
          <div className="text-[#D4AF37] font-medium text-lg">{t.express.price}</div>
        </motion.div>
      </div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className={`mt-12 text-center ${language === "ar" ? "rtl" : ""}`}
      >
        <Link to="/services">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#D4AF37] text-[#1C1C1C] font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            {t.button}
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
};

export default WashTypeSelector;
