import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const VIPClubTeaser = () => {
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      title: "Akoya Club",
      subtitle: "FOR THE FEW WHO KNOW",
      description:
        "Our invitation-only membership program offers unparalleled benefits for those who demand the absolute best in garment care and convenience.",
      benefits: [
        "Priority scheduling with 2-hour pickup windows",
        "Dedicated garment concierge",
        "Complimentary fragrance infusion",
        "Luxury packaging as standard",
        "Bi-annual complimentary couture care",
        "Exclusive seasonal offers",
      ],
      request: "Request Invitation",
      learn: "Learn More",
      badge: "EXCLUSIVE",
    },
    ar: {
      title: "نادي أكويا",
      subtitle: "للقلة الذين يعرفون",
      description:
        "برنامج العضوية الحصري بالدعوة فقط يقدّم مزايا لا مثيل لها لأولئك الذين يطالبون بأفضل رعاية ممكنة للملابس.",
      benefits: [
        "جدولة أولوية بإطار زمني لمدة ساعتين للاستلام",
        "كونسيرج خاص للملابس",
        "إضافة عطر مجانية",
        "تغليف فاخر كمعيار",
        "عناية بالأزياء الراقية مجانًا مرتين سنويًا",
        "عروض موسمية حصرية",
      ],
      request: "طلب دعوة",
      learn: "اعرف المزيد",
      badge: "حصري",
    },
  };

  const t = translations[language];

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="relative bg-[#1C1C1C] py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      {/* Gold texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('./home/exclusive.jpg')]"></div>

      {/* Decorative borders */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="./home/aquaClub.jpg"
                alt="VIP Laundry Service"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C] via-transparent to-transparent"></div>
            </div>

            {/* VIP Badge */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring" }}
              className={`absolute -top-5 ${language === "ar" ? "-left-5" : "-right-5"} bg-[#D4AF37] text-[#1C1C1C] px-6 py-3 rounded-full font-bold flex items-center shadow-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              {t.badge}
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#D4AF37] mb-4 tracking-tight">
              {t.title}
            </h2>
            <p className="text-lg text-white/80 mb-2 tracking-widest font-medium">
              {t.subtitle}
            </p>
            <div className="w-20 h-0.5 bg-[#D4AF37] my-6"></div>

            <p className="text-white/90 mb-8 leading-relaxed">{t.description}</p>

            <ul className="space-y-4 mb-10">
              {t.benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start text-white/90"
                >
                  <svg
                    className="w-5 h-5 text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </ul>

            {/* Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 ${
                language === "ar" ? "sm:flex-row-reverse" : ""
              }`}
            >
              <motion.button
                whileHover={{
                  backgroundColor: "#D4AF37",
                  color: "#1C1C1C",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-medium flex items-center justify-center gap-2"
              >
                {t.request}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{
                  backgroundColor: "#D4AF37",
                  color: "#1C1C1C",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-[#D4AF37] text-[#1C1C1C] rounded-full font-medium flex items-center justify-center gap-2"
              >
                {t.learn}
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VIPClubTeaser;
