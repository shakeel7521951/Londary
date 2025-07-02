import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#1C1C1C] text-white border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Brand Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
          <img src="./logo.png" alt="company logo" loading="lazy" className="w-24 mt-4 mx-auto"/>            
          </div>
          <p className="text-white/70 mb-4 leading-relaxed">
            Luxury garment care redefined. Serving Doha's discerning clients with unparalleled quality and service.
          </p>
          <div className="flex gap-4 mt-6">
            {['twitter', 'instagram', 'facebook'].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ y: -3, color: '#D4AF37' }}
                className="text-white/70 hover:text-[#D4AF37] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={`M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z`} />
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
          <h3 className="text-lg font-medium text-[#D4AF37] mb-6 tracking-wider">OUR SERVICES</h3>
          <ul className="space-y-3">
            {['Premium Laundry', 'Dry Cleaning', 'Steam Pressing', 'Fragrance Infusion', 'Couture Care', 'VIP Club'].map((service) => (
              <motion.li 
                key={service}
                whileHover={{ x: 5 }}
              >
                <a href="#" className="text-white/70 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  <svg className="w-3 h-3 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {service}
                </a>
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
          <h3 className="text-lg font-medium text-[#D4AF37] mb-6 tracking-wider">CONTACT US</h3>
          <address className="not-italic text-white/70 space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>West Bay, Doha, Qatar</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+974 1234 5678</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@akoyalaundry.com</span>
            </div>
          </address>
        </motion.div>

        {/* Column 4: Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-medium text-[#D4AF37] mb-6 tracking-wider">NEWSLETTER</h3>
          <p className="text-white/70 mb-6">
            Subscribe for exclusive offers and garment care tips.
          </p>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#D4AF37]/30 rounded focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-white placeholder-white/50"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-[#D4AF37] text-[#1C1C1C] font-medium rounded transition-colors"
            >
              Subscribe
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
          <div>© {new Date().getFullYear()} Akoya Laundry. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Sitemap</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;