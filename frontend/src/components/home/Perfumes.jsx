import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const perfumes = [
  {
    id: 1,
    name_en: "Moony Akoya",
    name_ar: "موني أكويا",
    description_en: "A luxurious and feminine fragrance inspired by the elegance of silk and opulence. Moony blends the freshness of blood orange and mandarin with a soft floral-fruity heart, resting on a warm base of vanilla, patchouli, and amber. Perfect for women who embrace grace and sophistication.",
    description_ar: "هو عطر فاخر وأنثوي مستوحى من سحر الترف والحرير، يجمع بين نضارة البرتقال الدموي واليوسفي، مع قلب زهري فاكهي ناعم، وقاعدة دافئة من الفانيليا والباتشولي والعنبر. مثالي لمحبات الأناقة والرقي.",
    price: "7 QAR",
    image: "/home/moony.jpg",
  },
  {
    id: 2,
    name_en: "Orchid Akoya",
    name_ar: "أوركيد أكويا",
    description_en: "A luxurious fragrance that combines the strength of Nepalese oud with the softness of Turkish rose, enriched with saffron and frankincense. Orchid is crafted for a mysterious and refined presence — an irresistible blend for lovers of elegance and distinction.",
    description_ar: "هو عطر فاخر يجمع بين قوة العود النيبالي ونعومة الورد التركي، مدعوماً بالزعفران واللبان ليمنحك حضوراً عاطفاً وراقياً. تركيبة غنية وجذابة لعشاق الفخامة والتميز.",
    price: "7 QAR",
    image: "/home/orchard.jpg",
  },
  {
    id: 3,
    name_en: "Elixr by Akoya",
    name_ar: "إكسير من أكويا",
    description_en: "A bold and masculine fragrance that fuses fresh fruits with deep woods and leather, Elixir reflects a commanding and successful personality. Its long-lasting presence and unforgettable scent make it a statement of power and confidence.",
    description_ar: "هو عطر ذكوري فاخر يمزج بين نضارة الفواكه وقوة الأخشاب والجلد، يعكس شخصية قيادية وناجحة، يتميز بثبات قوي ورائحة فريدة لا تُنسى.",
    price: "7 QAR",
    image: "/home/elixr.jpg",
  },
  {
    id: 4,
    name_en: "Imperial Akoya",
    name_ar: "إمبريال أكويا",
    description_en: "A fresh and refined citrus fragrance, blending bergamot and black tea with a touch of ginger. Imperial is perfect for summer and the modern man seeking luxurious freshness and clarity in every note.",
    description_ar: "عطر حمضي نظيف وأنيق، يجمع بين البرغموت والشاي الأسود مع لمسة زنجبيل. مثالي للصيف والرجل العصري الباحث عن الانتعاش الفاخر.",
    price: "7 QAR",
    image: "/home/imperial.jpg",
  },
];

const Perfumes = () => {
  const language = useSelector((state) => state.language.language); // 'en' or 'ar'

  return (
    <section className="py-12 bg-gray-100 px-4 md:px-12" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {language === "ar" ? "عطور أكويا المميزة" : "Akoya Signature Fragrances"}
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
                {language === "ar" ? perfume.description_ar : perfume.description_en}
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
