// components/Services.js
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Services Data
  const services = [
    // Existing services
    {
      id: 1,
      title: "Dry Cleaning",
      category: "dry-cleaning",
      description: "Expert care for suits and delicate fabrics using eco-friendly solvents",
      price: "From 50 QAR",
      icon: "🧥",
      image: "./home/dryCleaning.jpg",
    },
    {
      id: 2,
      title: "Executive Pressing",
      category: "pressing",
      description: "Crisp finishes for business attire with precision steam technology",
      price: "From 35 QAR",
      icon: "👔",
      image: "./home/exectivePressing.jpg",
    },
    {
      id: 3,
      title: "Couture Care",
      category: "specialty",
      description: "Hand-cleaning for designer garments and delicate fabrics",
      price: "From 120 QAR",
      icon: "👗",
      image: "./home/care.jpg",
    },
    {
      id: 4,
      title: "Bisht Restoration",
      category: "specialty",
      description: "Traditional cleaning and pressing for Qatari formal wear",
      price: "From 80 QAR",
      icon: "🕌",
      image: "./home/resturation.jpg",
    },
    {
      id: 5,
      title: "Express Service",
      category: "express",
      description: "3-hour turnaround for urgent garment needs",
      price: "+30% Premium",
      icon: "⚡",
      image: "./home/sehedulePickup.jpg",
    },
    {
      id: 6,
      title: "Fragrance Infusion",
      category: "addon",
      description: "Luxury scent options for your garments",
      price: "20 QAR",
      icon: "🌸",
      image: "./home/fragrance.jpg",
    },

    // Traditional Wear - Qatari
    {
      id: 7,
      title: "Dishdasha",
      category: "traditional",
      description: "Professional care for men's traditional Qatari garment",
      price: "From 45 QAR",
      icon: "👳‍♂️",
      image: "./services/dishdasha.webp",
    },
    {
      id: 8,
      title: "Child Dishdasha",
      category: "traditional",
      description: "Specialized care for children's traditional garments",
      price: "From 35 QAR",
      icon: "👦",
      image: "./services/child_dishdasha.jpg",
    },
    {
      id: 9,
      title: "Bisht",
      category: "traditional",
      description: "Premium care for ceremonial cloak with gold detailing",
      price: "From 90 QAR",
      icon: "🪔",
      image: "./services/bisht.jpg",
    },
    {
      id: 10,
      title: "Ghutra",
      category: "traditional",
      description: "Gentle cleaning for traditional headwear",
      price: "From 25 QAR",
      icon: "🧕",
      image: "./services/ghutra.jpg",
    },

    // Traditional Wear - South Asian
    {
      id: 11,
      title: "Kurta",
      category: "traditional",
      description: "Care for traditional South Asian tunic",
      price: "From 40 QAR",
      icon: "👘",
      image: "./services/kurta.jpg",
    },
    {
      id: 12,
      title: "Kurta Pyjama (Set)",
      category: "traditional",
      description: "Complete set cleaning for traditional attire",
      price: "From 60 QAR",
      icon: "👖",
      image: "./services/kurtaPajama.jpg",
    },
    {
      id: 13,
      title: "Kameez",
      category: "traditional",
      description: "Professional care for traditional long shirts",
      price: "From 45 QAR",
      icon: "👕",
      image: "./services/kameez.jpg",
    },
    {
      id: 14,
      title: "Jalabiya",
      category: "traditional",
      description: "Specialized care for flowing traditional gowns",
      price: "From 55 QAR",
      icon: "👚",
      image: "./services/jalabiya.jpg",
    },

    // Women's Wear
    {
      id: 15,
      title: "Abaya",
      category: "traditional",
      description: "Professional cleaning for everyday abayas",
      price: "From 50 QAR",
      icon: "🧕",
      image: "./services/abaya.jpg",
    },
    {
      id: 16,
      title: "Abaya Special",
      category: "traditional",
      description: "Premium care for embellished abayas",
      price: "From 80 QAR",
      icon: "✨",
      image: "./services/abaya_special.jpg",
    },
    {
      id: 17,
      title: "Hijab",
      category: "traditional",
      description: "Delicate cleaning for headscarves",
      price: "From 20 QAR",
      icon: "🧣",
      image: "./services/hijab.png",
    },

    // Western Wear
    {
      id: 18,
      title: "Gent Suit (3pcs)",
      category: "dry-cleaning",
      description: "Complete care for 3-piece suits",
      price: "From 75 QAR",
      icon: "👔",
      image: "./services/gent_suit.jpg",
    },
    {
      id: 19,
      title: "Dress (Short)",
      category: "dry-cleaning",
      description: "Care for cocktail and summer dresses",
      price: "From 45 QAR",
      icon: "👗",
      image: "./services/dress.jpg",
    },
    {
      id: 20,
      title: "Dress (Long)",
      category: "dry-cleaning",
      description: "Specialized care for evening gowns",
      price: "From 65 QAR",
      icon: "👰",
      image: "./services/dressLong.jpg",
    },
    {
      id: 21,
      title: "Overcoat",
      category: "dry-cleaning",
      description: "Winter coat cleaning and preservation",
      price: "From 70 QAR",
      icon: "🧥",
      image: "./services/overcoat.jpg",
    },
    {
      id: 22,
      title: "Military Uniform",
      category: "specialty",
      description: "Regimental standard cleaning and pressing",
      price: "From 85 QAR",
      icon: "🎖️",
      image: "./services/military_suite.jpg",
    },
    {
      id: 23,
      title: "Blouse (Special)",
      category: "specialty",
      description: "Delicate care for embellished tops",
      price: "From 55 QAR",
      icon: "👚",
      image: "./services/blouse.jpg",
    },
    {
      id: 24,
      title: "Bath Robe",
      category: "specialty",
      description: "Deep cleaning for plush bathrobes",
      price: "From 40 QAR",
      icon: "🛁",
      image: "./services/bathrob.jpg",
    },
  ];

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((service) => service.category === activeTab);

  return (
    <div>
      {/* Services Grid Section */}
      <section className="py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#1C1C1C] mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-3 tracking-tight">
              Our Services
            </h2>
            <div className="flex justify-center items-center">
              <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
              <p className="text-lg text-[#D4AF37] tracking-widest font-medium">
                LUXURY GARMENT CARE
              </p>
              <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[
              "all",
              "dry-cleaning",
              "pressing",
              "specialty",
              "traditional",
              "express",
              "addon",
            ].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-[#1C1C1C] text-[#D4AF37]"
                    : "bg-white text-[#1C1C1C] hover:bg-[#1C1C1C]/10"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.replace("-", " ")}
              </motion.button>
            ))}
          </motion.div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-[#1C1C1C] text-xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                    {service.icon}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium text-[#1C1C1C]">
                      {service.title}
                    </h3>
                    <span className="text-[#D4AF37] font-medium">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-[#2C2C2C] mb-4">{service.description}</p>

                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-px bg-[#D4AF37]/30 my-4"
                  />
                  <Link to="/book-now">
                    <motion.button
                      whileHover={{
                        backgroundColor: "#1C1C1C",
                        color: "#D4AF37",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-2.5 bg-[#D4AF37] text-[#1C1C1C] rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                       Order
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;