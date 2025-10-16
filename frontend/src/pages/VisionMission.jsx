import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VisionMission = () => {
  const language = useSelector((state) => state.language.language);
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Vision & Mission",
      subtitle: "Akoya Premium Laundry",
      tagline: "Redefining Fabric Care and Personal Luxury in Qatar",
      vision: {
        title: "Our Vision",
        content:
          "To redefine fabric care and personal luxury in Qatar through innovation, fragrance, and flawless service — making Akoya Premium Laundry the symbol of elegance and trust in every home.",
      },
      mission: {
        title: "Our Mission",
        content:
          "At Akoya Premium Laundry, we strive to offer premium laundry, delivery, and custom perfume solutions that combine technology, artistry, and care. Our mission is to transform daily routines into refined experiences through exceptional service, attention to detail, and sustainable practices.",
      },
      values: {
        title: "Our Core Values",
        items: [
          {
            title: "Excellence",
            description:
              "Every item, every wash, every fragrance meets the highest standards.",
          },
          {
            title: "Innovation",
            description:
              "We use advanced systems and smart logistics to deliver faster and cleaner results.",
          },
          {
            title: "Sustainability",
            description:
              "We commit to eco-friendly methods and responsible operations.",
          },
          {
            title: "Customer Focus",
            description: "Your satisfaction drives everything we do.",
          },
        ],
      },
      cta: {
        title: "Experience Excellence Today",
        button: "Book Now",
      },
    },
    ar: {
      title: "الرؤية والرسالة",
      subtitle: "أكويا لخدمات الغسيل الفاخرة",
      tagline: "إعادة تعريف العناية بالملابس والفخامة الشخصية في قطر",
      vision: {
        title: "رؤيتنا",
        content:
          "إعادة تعريف العناية بالملابس والفخامة الشخصية في قطر من خلال الابتكار والعطور والخدمة الخالية من العيوب - جعل أكويا لخدمات الغسيل الفاخرة رمزاً للأناقة والثقة في كل منزل.",
      },
      mission: {
        title: "رسالتنا",
        content:
          "في أكويا لخدمات الغسيل الفاخرة، نسعى لتقديم حلول الغسيل والتوصيل والعطور المخصصة المميزة التي تجمع بين التكنولوجيا والفن والعناية. مهمتنا هي تحويل الروتين اليومي إلى تجارب راقية من خلال الخدمة الاستثنائية والاهتمام بالتفاصيل والممارسات المستدامة.",
      },
      values: {
        title: "قيمنا الأساسية",
        items: [
          {
            title: "التميز",
            description: "كل قطعة، كل غسلة، كل عطر يلبي أعلى المعايير.",
          },
          {
            title: "الابتكار",
            description:
              "نستخدم أنظمة متطورة وخدمات لوجستية ذكية لتقديم نتائج أسرع وأنظف.",
          },
          {
            title: "الاستدامة",
            description: "نلتزم بالطرق الصديقة للبيئة والعمليات المسؤولة.",
          },
          {
            title: "التركيز على العميل",
            description: "رضاك يدفع كل ما نقوم به.",
          },
        ],
      },
      cta: {
        title: "اختبر التميز اليوم",
        button: "احجز الآن",
      },
    },
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            {currentContent.title}
          </h1>
          <p className="text-xl text-[#D4AF37] font-semibold mb-3">
            {currentContent.subtitle}
          </p>
          <p className="text-gray-600 text-base italic max-w-3xl mx-auto">
            {currentContent.tagline}
          </p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
        </motion.div>

        {/* Main Content - Two Column Layout (Image Left, Content Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vertical Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/terms/ourmission.jpeg"
                  alt="Akoya Premium Laundry Excellence"
                  className="w-full h-[700px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {language === "ar"
                      ? "التميز في كل تفصيلة"
                      : "Excellence in Every Detail"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {language === "ar"
                      ? "تكنولوجيا، فن، وعناية"
                      : "Technology, Artistry, and Care"}
                  </p>
                </div>
              </div>

              {/* CTA Card Below Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 bg-gradient-to-br from-[#D4AF37] to-[#c9a227] rounded-xl shadow-lg p-6 text-white"
              >
                <h4 className="font-bold text-lg mb-3">
                  {currentContent.cta.title}
                </h4>
                <button
                  onClick={() => navigate("/order")}
                  className="w-full bg-white text-[#D4AF37] hover:bg-gray-100 font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  {currentContent.cta.button}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 bg-gradient-to-br from-[#D4AF37] to-[#c9a227] p-8 sm:p-12 flex items-center justify-center">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white text-center">
                    {currentContent.vision.title}
                  </h2>
                </div>
                <div className="lg:col-span-3 p-8 sm:p-12 flex items-center">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentContent.vision.content}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {language === "ar" ? (
                  <>
                    <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 flex items-center justify-center order-1 lg:order-2">
                      <h2 className="text-4xl sm:text-5xl font-bold text-white text-center">
                        {currentContent.mission.title}
                      </h2>
                    </div>
                    <div className="lg:col-span-3 p-8 sm:p-12 flex items-center order-2 lg:order-1">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {currentContent.mission.content}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:col-span-3 p-8 sm:p-12 flex items-center">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {currentContent.mission.content}
                      </p>
                    </div>
                    <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-12 flex items-center justify-center">
                      <h2 className="text-4xl sm:text-5xl font-bold text-white text-center">
                        {currentContent.mission.title}
                      </h2>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Core Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 text-center">
                {currentContent.values.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentContent.values.items.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="relative p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border-l-4 border-[#D4AF37] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          {/* End Right Column */}
        </div>
        {/* End Two Column Grid */}
      </div>
    </div>
  );
};

export default VisionMission;
