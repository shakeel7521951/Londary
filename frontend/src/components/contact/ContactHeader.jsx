// components/ContactHeader.js
import { motion } from "framer-motion";

const ContactHeader = () => {
  return (
    <div className="relative bg-[#1C1C1C] text-white overflow-hidden h-96 min-h-[530px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[url('/images/laundry-bg.jpg')] bg-cover bg-center opacity-30"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
            Contact Akoya Laundry
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#D4AF37]">
            Premium laundry services tailored to your needs in Doha, Qatar
          </p>
          
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 h-px bg-[#D4AF37] w-32 mx-auto"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ContactHeader;