import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const language = useSelector((state) => state.language.language); // en or ar

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const contactDetails = [
    {
      title: language === "ar" ? "الموقع" : "Location",
      value: "West Bay, Doha, Qatar",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      ),
    },
    {
      title: language === "ar" ? "رقم الهاتف" : "Phone",
      value: "+974 1234 5678",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      ),
    },
    {
      title: language === "ar" ? "البريد الإلكتروني" : "Email",
      value: "info@akoyalaundry.com",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      ),
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    },
    {
      name: "Twitter",
      icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
    },
    {
      name: "WhatsApp",
      icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    },
  ];

  return (
    <section
      id="contact"
      className="relative bg-[#f8f5f2] py-24 px-6 md:px-16 lg:px-24 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#1C1C1C] mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-3 tracking-tight">
            {language === "ar" ? "تواصل معنا" : "Contact Us"}
          </h2>
          <div className="flex justify-center items-center">
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-lg text-[#D4AF37] tracking-widest font-medium">
              {language === "ar" ? "ابقى على تواصل" : "GET IN TOUCH"}
            </p>
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-medium text-[#1C1C1C] mb-6">
              {language === "ar" ? "كيفية الوصول إلينا" : "How to reach us"}
            </h3>
            <p className="text-[#2C2C2C] mb-8 leading-relaxed">
              {language === "ar"
                ? "فريق الكونسيرج لدينا متاح لمساعدتك في أي استفسارات حول خدمات الغسيل الفاخرة لدينا. تواصل معنا عبر الطريقة المفضلة لديك وسنرد عليك بسرعة."
                : "Our concierge team is available to assist you with any inquiries about our luxury laundry services. Reach out via your preferred method and we'll respond promptly."}
            </p>

            <div className="space-y-6">
              {contactDetails.map((detail, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="bg-[#D4AF37]/10 p-3 rounded-lg mr-4">
                    <svg
                      className="w-6 h-6 text-[#D4AF37]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {detail.icon}
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[#1C1C1C]">
                      {detail.title}
                    </h4>
                    <p className="text-[#2C2C2C]">{detail.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <h4 className="text-lg font-medium text-[#1C1C1C] mb-4">
                {language === "ar" ? "تابعنا" : "Follow Us"}
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    whileHover={{ y: -3, backgroundColor: "#D4AF37" }}
                    className="w-10 h-10 rounded-full bg-[#1C1C1C] text-white flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d={social.icon}
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-8 lg:p-10"
          >
            <h3 className="text-xl font-medium text-[#1C1C1C] mb-6">
              {language === "ar" ? "أرسل لنا رسالة" : "Send us a message"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#2C2C2C] mb-2"
                >
                  {language === "ar" ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#00000010] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition bg-[#fafafa]"
                  placeholder={
                    language === "ar" ? "أدخل اسمك" : "Enter your name"
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2C2C2C] mb-2"
                >
                  {language === "ar"
                    ? "عنوان البريد الإلكتروني"
                    : "Email Address"}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#00000010] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition bg-[#fafafa]"
                  placeholder={
                    language === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : "Enter your email"
                  }
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-[#2C2C2C] mb-2"
                >
                  {language === "ar" ? "رسالتك" : "Your Message"}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-[#00000010] rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition bg-[#fafafa]"
                  placeholder={
                    language === "ar"
                      ? "كيف يمكننا مساعدتك؟"
                      : "How can we help you?"
                  }
                  rows="5"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-[#1C1C1C] text-white font-medium rounded-lg transition-colors"
              >
                {language === "ar" ? "إرسال الرسالة" : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
