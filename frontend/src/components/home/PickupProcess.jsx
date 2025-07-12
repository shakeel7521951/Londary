import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const PickupProcess = () => {
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      sectionTitle: "How It Works",
      sectionSubtitle: "SEAMLESS PICKUP PROCESS",
      button: "Schedule Your Pickup",
      steps: [
        {
          id: 1,
          title: "Schedule Your Pickup",
          description:
            "Book through our app, WhatsApp, or website. We offer flexible 2-hour pickup windows.",
          bullet1: "24/7 booking availability",
          bullet2: "Recurring pickup scheduling available",
        },
        {
          id: 2,
          title: "Professional Collection",
          description:
            "Our uniformed valets arrive in discreet luxury vehicles with garment bags.",
          bullet1: "Contactless pickup available",
          bullet2: "Digital receipt provided",
        },
        {
          id: 3,
          title: "Expert Processing",
          description:
            "Your garments receive specialized care at our state-of-the-art facility.",
          bullet1: "Individual garment tracking",
          bullet2: "Quality control at every stage",
        },
        {
          id: 4,
          title: "Luxury Delivery",
          description:
            "Impeccably packaged garments returned at your preferred time.",
          bullet1: "Same-day delivery available",
          bullet2: "Hanger-ready with protective covers",
        },
      ],
    },
    ar: {
      sectionTitle: "كيف يعمل",
      sectionSubtitle: "عملية الاستلام السلسة",
      button: "جدول استلامك",
      steps: [
        {
          id: 1,
          title: "جدول الاستلام",
          description:
            "احجز من خلال التطبيق أو الواتساب أو الموقع. نقدم نوافذ مرنة مدتها ساعتان.",
          bullet1: "حجوزات متاحة 24/7",
          bullet2: "جدولة استلام متكررة متاحة",
        },
        {
          id: 2,
          title: "جمع احترافي",
          description:
            "يصل موظفونا بزي رسمي في مركبات فاخرة مزودة بحقائب الملابس.",
          bullet1: "استلام بدون تلامس متاح",
          bullet2: "إيصال رقمي مقدم",
        },
        {
          id: 3,
          title: "معالجة احترافية",
          description:
            "تُعالج الملابس بعناية في منشأتنا الحديثة ذات التقنية العالية.",
          bullet1: "تتبع فردي لكل قطعة",
          bullet2: "مراقبة جودة في كل مرحلة",
        },
        {
          id: 4,
          title: "توصيل فاخر",
          description:
            "إرجاع الملابس المغلفة بأناقة في الوقت الذي يناسبك.",
          bullet1: "توصيل في نفس اليوم متاح",
          bullet2: "جاهزة على الشماعة مع أغلفة واقية",
        },
      ],
    },
  };

  const t = translations[language];

  const steps = t.steps.map((step, index) => ({
    ...step,
    image: [
      "./home/Pickup.mp4",
      "./home/professional_collection.mp4",
      "./home/ExpertProcessing.mp4",
      "./home/luxury.jpg",
    ][index],
    icon: icons[index],
  }));

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`bg-[#f8f5f2] py-12 px-6 md:px-16 lg:px-24 relative overflow-hidden ${
        language === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#1C1C1C] mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-3">
            {t.sectionTitle}
          </h2>
          <div className="flex justify-center items-center">
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-lg text-[#D4AF37] tracking-widest font-medium">
              {t.sectionSubtitle}
            </p>
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-[#D4AF37] transform -translate-x-1/2"></div>
          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-16`}
              >
                {/* Media */}
                <motion.div
                  className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.02 }}
                >
                  {step.image.endsWith(".mp4") ? (
                    <video
                      className="w-full h-64 md:h-80 object-cover"
                      muted
                      autoPlay
                      loop
                    >
                      <source src={step.image} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  )}
                </motion.div>

                {/* Text */}
                <div className="w-full md:w-1/2 relative">
                  <motion.div
                    className={`hidden md:flex absolute ${
                      language === "ar" ? "-right-24" : "-left-24"
                    } top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-[#D4AF37] text-white items-center justify-center font-bold text-xl shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.id}
                  </motion.div>

                  <div className="bg-white p-8 rounded-xl shadow-lg relative z-10">
                    <div
                      className={`md:hidden absolute -top-5 ${
                        language === "ar" ? "-right-5" : "-left-5"
                      } w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold shadow-md`}
                    >
                      {step.id}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-[#D4AF37]">{step.icon}</div>
                      <h3 className="text-xl md:text-2xl font-medium text-[#1C1C1C]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#2C2C2C] mb-6">{step.description}</p>

                    <ul className="space-y-2 text-sm text-[#2C2C2C] pt-4 border-t border-[#00000010]">
                      <li className="flex items-start">
                        <CheckIcon language={language} />
                        <span>{step.bullet1}</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon language={language} />
                        <span>{step.bullet2}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-[#1C1C1C] text-white rounded-full font-medium flex items-center mx-auto gap-3 text-sm tracking-wider"
          >
            {t.button}
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Icons
const icons = [
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>,
];

// Reusable check icon
const CheckIcon = ({ language }) => (
  <svg
    className={`w-4 h-4 text-[#D4AF37] mt-0.5 ${
      language === "ar" ? "ml-2" : "mr-2"
    } flex-shrink-0`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default PickupProcess;
