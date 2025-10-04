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
            {/* Twitter/X */}
            <motion.a
              href="#"
              whileHover={{ y: -3, color: "#D4AF37" }}
              className="text-white/70 hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </motion.a>
            {/* Instagram */}
            <motion.a
              href="#"
              whileHover={{ y: -3, color: "#D4AF37" }}
              className="text-white/70 hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </motion.a>
            {/* Facebook */}
            <motion.a
              href="#"
              whileHover={{ y: -3, color: "#D4AF37" }}
              className="text-white/70 hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
              </svg>
            </motion.a>
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
            <Link
              to="/privacy"
              className="hover:text-[#D4AF37] transition-colors"
            >
              {t.privacy}
            </Link>
            <Link
              to="/terms"
              className="hover:text-[#D4AF37] transition-colors"
            >
              {t.terms}
            </Link>
            <Link
              to="/sitemap"
              className="hover:text-[#D4AF37] transition-colors"
            >
              {t.sitemap}
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
