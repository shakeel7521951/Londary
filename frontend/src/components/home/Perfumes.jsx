import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const perfumes = [
  {
    id: 1,
    name_en: "Maknoun",
    name_ar: "مكنون",
    description_en:
      "A luxurious fragrance that embodies the charm of a confident man. A refined blend of fresh fruits, elegant florals, and a warm base of musk and amber, leaving an unforgettable signature.",
    description_ar:
      "هو عطر الفخامة الذي يجسد حضور الرجل الواثق. مزيج أنيق من الفواكه المنعشة والزهور الراقية مع قاعدة دافئة من المسك والعنبر، ليمنحك توقيعًا عطريًا لا يُنسى.",
    price: "7 QAR",
    image: "/home/maknoun.jpg",
  },
  {
    id: 2,
    name_en: "Mad",
    name_ar: "مد",
    description_en:
      "A powerful masculine fragrance that radiates prestige and luxury. Its unique composition blends saffron, jasmine, and incense, with a leathery amber base for a timeless presence.",
    description_ar:
      "هو العطر الرجولي القوي الذي يعكس الهيبة والفخامة. تركيبته المميزة تمزج بين الزعفران والياسمين والبخور مع قاعدة جلدية وعنبرية تمنحك حضورًا أسطوريًا يدوم.",
    price: "7 QAR",
    image: "/home/mad.jpg",
  },
  {
    id: 3,
    name_en: "Lulwa",
    name_ar: "لولوه",
    description_en:
      "The fragrance of radiant femininity, combining modern freshness with timeless elegance. A stunning blend of bergamot, ginger, and patchouli with a soft musky touch, leaving a memorable sparkle.",
    description_ar:
      "هو عطر الأنوثة المتألقة، يجمع بين الانتعاش العصري والرقي الخالد. توليفة مبهرة من البرغموت والزنجبيل والباتشولي مع لمسة مسكية ناعمة تمنحك بريقًا لا يُنسى.",
    price: "7 QAR",
    image: "/home/lulwa.jpg",
  },
  {
    id: 4,
    name_en: "Sadf",
    name_ar: "صدف",
    description_en:
      "A refreshing fragrance for both men and women, featuring bright citrus notes, warm ginger, and ambergris for an elegant and long-lasting touch.",
    description_ar:
      "هو العطر المنعش الذي يناسب الرجال والنساء، بتركيبته الحمضية المشرقة ولمسة الزنجبيل والعنبر التي تمنحه أناقة عصرية وثباتًا راقيًا.",
    price: "7 QAR",
    image: "/home/sadf.jpg",
  },
];

const Perfumes = () => {
  const language = useSelector((state) => state.language.language); // 'en' or 'ar'

  return (
    <section
      className="py-12 bg-gray-100 px-4 md:px-12"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {language === "ar"
            ? "عطور أكويا المميزة"
            : "Akoya Signature Fragrances"}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {language === "ar"
            ? "عطور فاخرة مصممة لتعزيز تجربة الغسيل الخاصة بك"
            : "Premium scents crafted to elevate your laundry experience"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perfumes.map((perfume) => (
          <motion.div
            key={perfume.id}
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: [0, 1], y: [20, 0] }}
            transition={{ duration: 0.4, delay: perfume.id * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Image */}
            <img
              src={perfume.image}
              alt={language === "ar" ? perfume.name_ar : perfume.name_en}
              className="w-full h-48 object-cover"
            />

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {language === "ar" ? perfume.name_ar : perfume.name_en}
              </h3>

              {/* Description should grow to take available space */}
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {language === "ar"
                  ? perfume.description_ar
                  : perfume.description_en}
              </p>

              {/* Price + Button always at bottom */}
              <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-[#D4AF37]">
                  {perfume.price}
                </span>
                <Link to="/book-now">
                  <button className="px-4 py-1 bg-[#D4AF37] text-white rounded-full text-sm hover:opacity-90 transition">
                    {language === "ar" ? "إضافة" : "Add"}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Perfumes;
