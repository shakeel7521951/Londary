import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      sectionTitle: "Loved by Doha's Finest",
      subtitle: "CLIENT TESTIMONIALS",
      cta: "Join Our Discerning Clients",
      testimonials: [
        {
          name: "Sheikha Al-Thani",
          role: "Fashion Designer",
          quote:
            "Akoya's attention to detail is unmatched. My delicate couture pieces return looking better than when they were new. The only service I trust with my collection.",
          rating: 5,
          image:
            "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          name: "Mr. Khalid Al-Mansoori",
          role: "Executive Director",
          quote:
            "As someone who wears bespoke suits daily, Akoya's executive service saves me hours each week. Their precision pressing is worth every dirham.",
          rating: 5,
          image:
            "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          name: "Mrs. Eleanor Rutherford",
          role: "Diplomat's Wife",
          quote:
            "The fragrance infusion option is divine. My clothes return smelling like a Parisian boutique. It's become my signature scent in Doha's social circles.",
          rating: 4,
          image:
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      ],
    },
    ar: {
      sectionTitle: "محبوب من نخبة الدوحة",
      subtitle: "آراء العملاء",
      cta: "انضم إلى عملائنا المميزين",
      testimonials: [
        {
          name: "الشيخة آل ثاني",
          role: "مصممة أزياء",
          quote:
            "الاهتمام بالتفاصيل لدى أكويا لا يُضاهى. تعود قطع الأزياء الراقية أفضل من حالتها الجديدة. الخدمة الوحيدة التي أثق بها.",
          rating: 5,
          image:
            "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          name: "خالد المنصوري",
          role: "المدير التنفيذي",
          quote:
            "أرتدي بدلات مصممة حسب الطلب يوميًا، وخدمة أكويا التنفيذية توفر لي ساعات كل أسبوع. ضغطهم الدقيق يستحق كل درهم.",
          rating: 5,
          image:
            "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
        {
          name: "إلينور رذرفورد",
          role: "زوجة دبلوماسي",
          quote:
            "خيار إضافة العطر رائع. تعود ملابسي برائحة كأنها من متجر باريس. أصبحت هذه الرائحة توقيعي الاجتماعي في الدوحة.",
          rating: 4,
          image:
            "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        },
      ],
    },
  };

  const t = translations[language];
  const currentTestimonial = t.testimonials[activeIndex];

  return (
    <section
      dir={language === "ar" ? "rtl" : "ltr"}
      className="bg-[#faf9f7] py-12 px-6 md:px-16 lg:px-24 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-[#1C1C1C] mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-3 tracking-tight">
            {t.sectionTitle}
          </h2>
          <div className="flex justify-center items-center">
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-lg text-[#D4AF37] tracking-widest font-medium">
              {t.subtitle}
            </p>
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
          </div>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <motion.div
            key={currentTestimonial.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Client Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-lg flex-shrink-0"
              >
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Testimonial Content */}
              <div className={`text-center ${language === "ar" ? "md:text-right" : "md:text-left"}`}>
                <div className={`flex ${language === "ar" ? "justify-start" : "justify-start"} mb-4`}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < currentTestimonial.rating ? "text-[#D4AF37]" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-lg italic text-[#2C2C2C] mb-6 leading-relaxed">
                  "{currentTestimonial.quote}"
                </blockquote>

                <div>
                  <p className="font-medium text-[#1C1C1C]">{currentTestimonial.name}</p>
                  <p className="text-sm text-[#D4AF37]">{currentTestimonial.role}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mb-12">
            {t.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? "bg-[#D4AF37] w-6" : "bg-[#D4AF37]/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-[#1C1C1C] text-white rounded-full font-medium flex items-center mx-auto gap-3 text-sm tracking-wider"
          >
            {t.cta}
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
