import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const VisionMission = () => {
  const language = useSelector((state) => state.language.language);

  const content = {
    en: {
      title: "Vision & Mission",
      subtitle: "Defining Excellence in Premium Laundry Services",
      vision: {
        title: "Our Vision",
        content:
          "To be the leading premium laundry service provider in the region, setting the gold standard for quality, luxury, and customer satisfaction while revolutionizing the way people experience garment care.",
        icon: "🌟",
      },
      mission: {
        title: "Our Mission",
        content:
          "At AKOYA Premium Laundry, we are committed to delivering exceptional laundry and dry cleaning services that exceed our customers' expectations. We combine state-of-the-art technology with traditional craftsmanship to ensure every garment receives the utmost care and attention it deserves.",
        icon: "🎯",
      },
      values: {
        title: "Our Core Values",
        items: [
          {
            title: "Excellence",
            description:
              "We pursue perfection in every service we provide, ensuring the highest quality standards in garment care.",
            icon: "💎",
          },
          {
            title: "Trust",
            description:
              "We build lasting relationships with our customers through reliability, transparency, and consistent service delivery.",
            icon: "🤝",
          },
          {
            title: "Innovation",
            description:
              "We continuously embrace new technologies and methods to enhance our services and customer experience.",
            icon: "⚡",
          },
          {
            title: "Sustainability",
            description:
              "We are committed to environmentally responsible practices in all our operations and processes.",
            icon: "🌱",
          },
          {
            title: "Luxury",
            description:
              "We provide premium services that reflect sophistication, elegance, and attention to detail.",
            icon: "✨",
          },
          {
            title: "Customer Focus",
            description:
              "Our customers are at the heart of everything we do, and their satisfaction is our ultimate goal.",
            icon: "❤️",
          },
        ],
      },
      commitment: {
        title: "Our Commitment",
        content:
          "We pledge to maintain the highest standards of service quality, treat every garment with care and respect, and continuously improve our processes to serve you better. Your trust in AKOYA Premium Laundry drives us to excel every day.",
      },
    },
    ar: {
      title: "الرؤية والرسالة",
      subtitle: "تحديد التميز في خدمات الغسيل الفاخرة",
      vision: {
        title: "رؤيتنا",
        content:
          "أن نكون مقدم خدمات الغسيل الفاخرة الرائد في المنطقة، ونضع المعيار الذهبي للجودة والفخامة ورضا العملاء بينما نثور طريقة تجربة الناس لرعاية الملابس.",
        icon: "🌟",
      },
      mission: {
        title: "رسالتنا",
        content:
          "في أكويا لخدمات الغسيل الفاخرة، نحن ملتزمون بتقديم خدمات غسيل وتنظيف جاف استثنائية تفوق توقعات عملائنا. نجمع بين التكنولوجيا المتطورة والحرفية التقليدية لضمان حصول كل قطعة ملابس على أقصى قدر من العناية والاهتمام التي تستحقها.",
        icon: "🎯",
      },
      values: {
        title: "قيمنا الأساسية",
        items: [
          {
            title: "التميز",
            description:
              "نسعى للكمال في كل خدمة نقدمها، مضمونين أعلى معايير الجودة في رعاية الملابس.",
            icon: "💎",
          },
          {
            title: "الثقة",
            description:
              "نبني علاقات دائمة مع عملائنا من خلال الموثوقية والشفافية وتقديم الخدمة المتسق.",
            icon: "🤝",
          },
          {
            title: "الابتكار",
            description:
              "نتبنى باستمرار تقنيات وطرق جديدة لتعزيز خدماتنا وتجربة عملائنا.",
            icon: "⚡",
          },
          {
            title: "الاستدامة",
            description:
              "نحن ملتزمون بالممارسات المسؤولة بيئياً في جميع عملياتنا وإجراءاتنا.",
            icon: "🌱",
          },
          {
            title: "الفخامة",
            description:
              "نقدم خدمات مميزة تعكس الأناقة والرقي والاهتمام بالتفاصيل.",
            icon: "✨",
          },
          {
            title: "التركيز على العميل",
            description:
              "عملاؤنا هم في قلب كل ما نفعله، ورضاهم هو هدفنا النهائي.",
            icon: "❤️",
          },
        ],
      },
      commitment: {
        title: "التزامنا",
        content:
          "نتعهد بالحفاظ على أعلى معايير جودة الخدمة، ومعاملة كل قطعة ملابس بعناية واحترام، وتحسين عملياتنا باستمرار لخدمتكم بشكل أفضل. ثقتكم في أكويا لخدمات الغسيل الفاخرة تدفعنا للتميز كل يوم.",
      },
    },
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
        </motion.div>

        <div className="space-y-16" dir={language === "ar" ? "rtl" : "ltr"}>
          {/* Vision Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">{currentContent.vision.icon}</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-6">
                {currentContent.vision.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                {currentContent.vision.content}
              </p>
            </div>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
          >
            <div className="text-center">
              <div className="text-6xl mb-6">{currentContent.mission.icon}</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-6">
                {currentContent.mission.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                {currentContent.mission.content}
              </p>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#D4AF37] mb-12 text-center">
              {currentContent.values.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentContent.values.items.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center p-6 rounded-xl bg-gradient-to-br from-[#FFF9E6] to-white border border-[#D4AF37]/20 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Commitment Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gradient-to-r from-[#D4AF37] to-[#c9a227] rounded-2xl shadow-xl p-8 sm:p-12 text-white"
          >
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {currentContent.commitment.title}
              </h2>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto opacity-95">
                {currentContent.commitment.content}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-8">
            {language === "ar"
              ? "استكشف خدماتنا المميزة اليوم"
              : "Experience our premium services today"}
          </p>
          <button
            onClick={() => (window.location.href = "/book-now")}
            className="bg-[#D4AF37] hover:bg-[#c9a227] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            {language === "ar" ? "احجز الآن" : "Book Now"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VisionMission;
