import { motion } from "framer-motion";

const WashTypeSelector = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-20 overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute w-60 h-60 bg-[#D4AF37] rounded-full blur-3xl top-20 left-10"></div>
        <div className="absolute w-80 h-80 bg-[#1C1C1C] rounded-full blur-3xl bottom-10 right-10"></div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1C] mb-4">
          How Would You Like It Washed?
        </h2>
        <p className="text-[#D4AF37] font-semibold text-lg tracking-wide uppercase">
          Choose your experience
        </p>
      </motion.div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Standard Wash */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#F5E1DA] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300"
        >
          <div className="text-5xl mb-4">🧼</div>
          <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Standard Wash
          </h3>
          <p className="text-[#2C2C2C] mb-4">
            Our signature 48-hour service with gentle cleaning, eco-friendly
            detergents, and basic folding.
          </p>
          <div className="text-[#D4AF37] font-medium text-lg">From 50 QAR</div>
        </motion.div>

        {/* Express Wash */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#F5E1DA] p-8 rounded-3xl shadow-lg hover:shadow-2xl transition duration-300"
        >
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">
            Express Wash
          </h3>
          <p className="text-[#2C2C2C] mb-4">
            Need it fast? Get 24-hour turnaround, priority processing, and
            premium care.
          </p>
          <div className="text-[#D4AF37] font-medium text-lg">From 80 QAR</div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#D4AF37] text-[#1C1C1C] font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          Continue to Garment Selection
        </motion.button>
      </motion.div>
    </section>
  );
};

export default WashTypeSelector;
