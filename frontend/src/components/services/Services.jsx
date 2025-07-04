import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const Services = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Services Data
  const services = [
    {
      id: 1,
      title: "Dry Cleaning",
      category: "dry-cleaning",
      description:
        "Expert care for suits and delicate fabrics using eco-friendly solvents",
      price: "From 50 QAR",
      icon: "🧥",
      image: "./home/dryCleaning.jpg",
    },
    {
      id: 2,
      title: "Executive Pressing",
      category: "pressing",
      description:
        "Crisp finishes for business attire with precision steam technology",
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
  ];

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((service) => service.category === activeTab);

  return (
    <div>
      {" "}
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
                      Add to Order
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
