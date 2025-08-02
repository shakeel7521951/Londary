import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const perfumes = [
  {
    id: 1,
    name: "Moony Akoya",
    description: "A soft, dreamy scent that refreshes your laundry with grace.",
    price: "7 QAR",
    image: "/home/moony.jpg",
  },
  {
    id: 2,
    name: "Orchid Akoya",
    description: "Elegant floral notes to enhance freshness in every fabric.",
    price: "7 QAR",
    image: "/home/orchard.jpg",
  },
  {
    id: 3,
    name: "Elixr by Akoya",
    description: "A rich, luxurious blend for a signature fragrance finish.",
    price: "7 QAR",
    image: "/home/elixr.jpg",
  },
  {
    id: 4,
    name: "Imperial Akoya",
    description: "Royal and bold—crafted for the finest laundry experience.",
    price: "7 QAR",
    image: "/home/imperial.jpg",
  },
];

const Perfumes = () => {
  return (
    <section className="py-12 bg-gray-100 px-4 md:px-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Akoya Signature Fragrances 
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Premium scents crafted to elevate your laundry experience
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perfumes.map((perfume) => (
          <motion.div
            key={perfume.id}
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: [0, 1], y: [20, 0] }}
            transition={{ duration: 0.4, delay: perfume.id * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={perfume.image}
              alt={perfume.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {perfume.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {perfume.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#D4AF37]">
                  {perfume.price}
                </span>
                <Link to="/book-now">
                <button className="px-4 py-1 bg-[#D4AF37] text-white rounded-full text-sm hover:opacity-90 transition">
                  Add
                </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Perfumes;
