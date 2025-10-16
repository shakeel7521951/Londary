import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PackagingOptions = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hoveredOption, setHoveredOption] = useState(null);
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      sectionTitle: "The Final Touch",
      sectionSubtitle: "PACKAGING OPTIONS",
      selected: "SELECTED",
      bookBtn: "Book Your Order",
      options: [
        {
          title: "Plastic Wrap",
          description:
            "Crystal-clear protective wrapping with our embossed gold seal for discreet luxury.",
          price: "Included",
          features: [
            "Medical-grade transparency",
            "Anti-static interior",
            "Recyclable material",
            "Tamper-evident closure",
          ],
        },
        {
          title: "Luxury Fabric Wrap",
          description:
            "Cashmere-lined protective casing with magnetic closure and monogram option.",
          price: "+25 QAR",
          features: [
            "Italian wool exterior",
            "Silk-lined interior",
            "Magnetic seal",
            "Reusable design",
          ],
        },
        {
          title: "Premium Gift Box",
          description:
            "Handcrafted wooden presentation case with velvet interior and scent capsule.",
          price: "+50 QAR",
          features: [
            "Sandalwood construction",
            "French velvet lining",
            "Integrated scent capsule",
            "Heirloom quality",
          ],
        },
      ],
    },
    ar: {
      sectionTitle: "اللمسة النهائية",
      sectionSubtitle: "خيارات التغليف",
      selected: "تم الاختيار",
      bookBtn: "احجز طلبك",
      options: [
        {
          title: "تغليف بلاستيكي",
          description:
            "تغليف شفاف بحماية مميزة وختم ذهبي لنقل الفخامة بكل أناقة.",
          price: "مجاني",
          features: [
            "شفافية طبية",
            "داخل مقاوم للكهرباء الساكنة",
            "مادة قابلة لإعادة التدوير",
            "إغلاق آمن يظهر العبث",
          ],
        },
        {
          title: "تغليف قماشي فاخر",
          description:
            "غلاف مبطن بالكشمير بإغلاق مغناطيسي وخيار إضافة الأحرف الأولى.",
          price: "+٢٥ ريال",
          features: [
            "صوف إيطالي فاخر",
            "بطانة من الحرير",
            "إغلاق مغناطيسي",
            "تصميم قابل لإعادة الاستخدام",
          ],
        },
        {
          title: "علبة هدية فاخرة",
          description: "صندوق خشبي مصنوع يدويًا ببطانة مخملية وكبسولة عطرية.",
          price: "+٥٠ ريال",
          features: [
            "مصنوع من خشب الصندل",
            "بطانة من المخمل الفرنسي",
            "كبسولة عطر مدمجة",
            "جودة تدوم للأجيال",
          ],
        },
      ],
    },
  };

  const t = translations[language];

  const packagingOptions = t.options.map((option, i) => ({
    ...option,
    id: ["plastic", "fabric", "box"][i],
    image: [
      "./home/professionalCollection.jpg",
      "./home/package.jpg",
      "./home/BOX.jpeg",
    ][i],
  }));

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`bg-[#faf9f7] py-12 px-6 md:px-16 lg:px-24 relative overflow-hidden ${
        language === "ar" ? "text-right" : ""
      }`}
    >
      {/* Texture */}
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7130555/pexels-photo-7130555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-5 mix-blend-overlay pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-3 tracking-tight">
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

        {/* Packaging Items */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {packagingOptions.map((option) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                onHoverStart={() => setHoveredOption(option.id)}
                onHoverEnd={() => setHoveredOption(null)}
                onClick={() => setSelectedOption(option.id)}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col ${
                  selectedOption === option.id
                    ? "ring-4 ring-[#D4AF37]"
                    : "ring-1 ring-[#00000010]"
                }`}
              >
                {/* Image */}
                <div className="relative h-94 overflow-hidden">
                  <motion.img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-contain"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: hoveredOption === option.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div
                    className={`absolute bottom-4 ${
                      language === "ar" ? "right-4" : "left-4"
                    }`}
                  >
                    <motion.span
                      animate={{
                        backgroundColor:
                          selectedOption === option.id ? "#1C1C1C" : "#D4AF37",
                        color:
                          selectedOption === option.id ? "#D4AF37" : "#1C1C1C",
                      }}
                      className="px-4 py-1.5 rounded-full text-sm font-medium tracking-wide shadow-md"
                    >
                      {option.price}
                    </motion.span>
                  </div>
                </div>

                {/* Text */}
                <motion.div
                  className="p-6 flex-grow flex flex-col"
                  animate={{ y: hoveredOption === option.id ? -5 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-xl font-medium text-[#1C1C1C] mb-2">
                    {option.title}
                  </h3>
                  <p className="text-[#2C2C2C] mb-4 text-sm leading-relaxed">
                    {option.description}
                  </p>

                  <div className="mt-auto space-y-2.5">
                    {option.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: language === "ar" ? -5 : 5 }}
                        className="flex items-start"
                      >
                        <svg
                          className={`w-4 h-4 text-[#D4AF37] mt-0.5 ${
                            language === "ar" ? "ml-2.5" : "mr-2.5"
                          } flex-shrink-0`}
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
                        <span className="text-sm text-[#1C1C1C] leading-tight">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Selection Bar */}
                <motion.div
                  animate={{
                    height: selectedOption === option.id ? 4 : 0,
                    backgroundColor: "#D4AF37",
                  }}
                  className="w-full"
                />
              </motion.div>

              {/* Ribbon */}
              {selectedOption === option.id && (
                <motion.div
                  initial={{ rotate: -45, scale: 0, y: -20 }}
                  animate={{
                    rotate: -45,
                    scale: 1,
                    y: 0,
                    transition: { type: "spring", stiffness: 500, damping: 15 },
                  }}
                  className={`absolute -top-3 ${
                    language === "ar" ? "-left-8" : "-right-8"
                  } bg-[#D4AF37] text-white px-8 py-1 font-medium text-xs shadow-lg`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.selected}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link to="/book-now">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#1C1C1C] text-white rounded-full font-medium flex items-center mx-auto gap-3 text-sm tracking-wider"
            >
              {t.bookBtn}
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PackagingOptions;
