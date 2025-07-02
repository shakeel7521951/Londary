import { motion } from "framer-motion";

const collections = [
  {
    title: "The Platinum Care",
    desc: "Our highest tier service for your most precious garments. Hand-washed, steamed, and wrapped in protective tissue.",
    image: "./home/luxuryDelivery.jpg",
    icon: "✨"
  },
  {
    title: "Executive Collection",
    desc: "Precision care for business attire. Perfect creases, stain removal, and fabric revitalization for your professional image.",
    image: "./home/expertProcessing.jpg",
    icon: "👔"
  },
  {
    title: "Couture Preservation",
    desc: "Specialized care for designer pieces and delicate fabrics. Museum-quality cleaning to maintain texture and color integrity.",
    image: "./home/professionalCollection.jpg",
    icon: "🧵"
  }
];

const SignatureLines = () => {
  return (
    <section className="bg-[#faf9f7] py-12 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#1C1C1C] mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#1C1C1C] mb-3 tracking-tight">
            Signature Lines
          </h2>
          <div className="flex justify-center items-center">
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-xl text-[#D4AF37] tracking-widest font-medium">
              THE AKOYA COLLECTION
            </p>
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
          </div>
        </motion.div>

        {/* Collection Items */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {collections.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1C1C1C] opacity-80 rounded-2xl z-10"></div>
              <div className="absolute inset-0 border border-[#ffffff20] rounded-2xl pointer-events-none"></div>
              
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-80 object-cover rounded-2xl brightness-95 group-hover:brightness-105 transition-all duration-500"
              />
              
              <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl mb-3 w-14 h-14 flex items-center justify-center bg-[#D4AF37] rounded-full text-white shadow-lg"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-2xl font-medium text-white mb-2">{item.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{item.desc}</p>
                
                <motion.button
                  whileHover={{ backgroundColor: "#1C1C1C", color: "#D4AF37" }}
                  className="mt-4 px-6 py-2 bg-[#D4AF37] text-[#1C1C1C] rounded-full text-sm font-medium flex items-center gap-2"
                >
                  Discover
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 border border-[#1C1C1C] text-[#1C1C1C] rounded-full hover:bg-[#1C1C1C] hover:text-white transition-all duration-300 flex items-center mx-auto gap-2">
            View All Collections
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default SignatureLines;