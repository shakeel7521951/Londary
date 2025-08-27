import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const language = useSelector((state) => state.language.language);

  const translations = {
    en: {
      desc: "Luxury garment care redefined. Serving Doha's discerning clients with unparalleled quality and service.",
      servicesTitle: "OUR SERVICES",
      services: [
        "Premium Laundry",
        "Dry Cleaning",
        "Steam Pressing",
        "Fragrance Infusion",
        "Couture Care",
        "VIP Club",
      ],
      contactTitle: "CONTACT US",
      address: "West Bay, Doha, Qatar",
      phone: "+974 1234 5678",
      email: "info@akoyalaundry.com",
      newsletterTitle: "NEWSLETTER",
      newsletterDesc: "Subscribe for exclusive offers and garment care tips.",
      newsletterPlaceholder: "Your email address",
      subscribe: "Subscribe",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      sitemap: "Sitemap",
    },
    ar: {
      desc: "رعاية فاخرة للملابس. نخدم عملاء الدوحة المميزين بجودة وخدمة لا مثيل لها.",
      servicesTitle: "خدماتنا",
      services: [
        "غسيل ممتاز",
        "التنظيف الجاف",
        "الكي بالبخار",
        "تعطير الملابس",
        "رعاية الأزياء الراقية",
        "نادي كبار الشخصيات",
      ],
      contactTitle: "اتصل بنا",
      address: "غرب الخليج، الدوحة، قطر",
      phone: "+٩٧٤ ١٢٣٤ ٥٦٧٨",
      email: "info@akoyalaundry.com",
      newsletterTitle: "النشرة الإخبارية",
      newsletterDesc: "اشترك للحصول على عروض حصرية ونصائح للعناية بالملابس.",
      newsletterPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشترك",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      sitemap: "خريطة الموقع",
    },
  };

  const t = translations[language];

  return (
    <footer className="bg-[#1C1C1C] text-white border-t border-[#D4AF37]/ mb-[-30px]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <img
              src="./companylogo.png"
              alt="company logo"
              loading="lazy"
              className="w-36 h-12 mt-4 mx-auto md:ml-4"
            />
          </div>
          <p className="text-white/70 mb-4 leading-relaxed">{t.desc}</p>
          <div className="flex gap-4 mt-6">
            {["twitter", "instagram", "facebook"].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ y: -3, color: "#D4AF37" }}
                className="text-white/70 hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={`M22.46 6c-.77.35-1.6.58-2.46.69...`} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Column 2: Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-medium text-[#D4AF37] mb-6 tracking-wider">
            {t.servicesTitle}
          </h3>
          <ul className="space-y-3">
            {t.services.map((service, idx) => (
              <motion.li key={idx} whileHover={{ x: 5 }}>
                <Link
                  to="/services"
                  className="text-white/70 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-3 h-3 text-[#D4AF37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {service}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Column 3: Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-medium text-[#D4AF37] mb-6 tracking-wider">
            {t.contactTitle}
          </h3>
          <address className="not-italic text-white/70 space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998..."
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{t.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#D4AF37] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28..."
                />
              </svg>
              <span>{t.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#D4AF37] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2..."
                />
              </svg>
              <span>{t.email}</span>
            </div>
          </address>
        </motion.div>

        {/* Column 4: Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-[#D4AF37] mb-6 tracking-wider">
            {t.newsletterTitle}
          </h3>
          <p className="text-white/70 mb-6">{t.newsletterDesc}</p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder={t.newsletterPlaceholder}
              className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#D4AF37]/30 rounded focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white placeholder-white/50"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-[#D4AF37] text-[#1C1C1C] font-medium rounded transition-colors"
            >
              {t.subscribe}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="border-t border-[#D4AF37]/10 py-6"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-white/50 text-sm">
          <div>{t.copyright}</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-[#D4AF37] transition-colors">
              {t.privacy}
            </Link>
            <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">
              {t.terms}
            </Link>
            <Link to="/sitemap" className="hover:text-[#D4AF37] transition-colors">
              {t.sitemap}
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
