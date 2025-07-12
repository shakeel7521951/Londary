import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const VIPConcierge = () => {
  const language = useSelector((state) => state.language.language);

  const content = {
    en: {
      heading: "Need Personalized Service?",
      paragraph: "Our VIP concierge team is available 24/7 to handle special requests, delicate items, or bulk orders for businesses and residences.",
      button: "Contact Concierge"
    },
    ar: {
      heading: "هل تحتاج إلى خدمة مخصصة؟",
      paragraph: "فريق الكونسيرج الخاص بنا متاح على مدار الساعة لتلبية الطلبات الخاصة، والعناية بالقطع الحساسة، أو الطلبات الكبيرة للشركات والمنازل.",
      button: "تواصل مع الكونسيرج"
    }
  };

  const { heading, paragraph, button } = content[language] || content.en;

  return (
    <div>
      {/* VIP Concierge CTA */}
      <div className="bg-[#1C1C1C] py-20 px-6 md:px-16 lg:px-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-light text-[#D4AF37] mb-6">
            {heading}
          </h3>
          <p className="text-white/80 mb-8">
            {paragraph}
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#D4AF37] text-[#1C1C1C] rounded-full font-medium inline-flex items-center gap-2"
            >
              {button}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default VIPConcierge;
