import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaUserCheck,
  FaClock,
  FaTshirt,
  FaSprayCan,
  FaBoxOpen,
  FaWhatsapp,
  FaRobot,
  FaPumpSoap,
  FaBox,
  FaGift
} from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="bg-[#f8f5f2] text-[#1C1C1C] font-sans">

      {/* Luxury Hero Banner */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/6069530/pexels-photo-6069530.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/80 via-[#1C1C1C]/40 to-[#1C1C1C]/10"></div>
        </div>
        
        <motion.div 
          className="absolute inset-0 flex flex-col justify-center items-center text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-light text-white mb-6"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Luxury Laundry. Reimagined.
          </motion.h1>
          <motion.div 
            className="flex items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-xl text-[#D4AF37] tracking-widest">AKOYA COLLECTION</p>
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
          </motion.div>
          <motion.button
            className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-8 py-3 rounded-full text-lg font-medium"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule Your Pickup
          </motion.button>
        </motion.div>
      </section>

      {/* Why Choose Akoya */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-light text-center mb-16"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="text-[#D4AF37]">Akoya</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <FaShieldAlt size={40} className="text-[#D4AF37] mx-auto mb-6" />,
                title: 'Premium Quality',
                desc: 'We use only the finest eco-friendly detergents and state-of-the-art equipment',
              },
              {
                icon: <FaUserCheck size={40} className="text-[#D4AF37] mx-auto mb-6" />,
                title: 'Personalized Service',
                desc: 'Tailored solutions for each garment with our expert fabric specialists',
              },
              {
                icon: <FaClock size={40} className="text-[#D4AF37] mx-auto mb-6" />,
                title: 'Convenience',
                desc: '24/7 booking with flexible pickup and delivery options',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-[#f8f5f2] p-8 rounded-xl text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {item.icon}
                <h3 className="text-xl font-medium mb-4">{item.title}</h3>
                <p className="text-[#2C2C2C]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Premium Services */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-[#f8f5f2]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-light text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our <span className="text-[#D4AF37]">Service</span> Journey
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaTshirt size={32} className="text-[#D4AF37] mb-4" />,
                title: '1. Select Wash Type',
                text: 'Standard or Express wash options to suit your needs',
              },
              {
                icon: <FaBoxOpen size={32} className="text-[#D4AF37] mb-4" />,
                title: '2. Choose Garments',
                text: 'From daily wear to delicate couture - we handle all',
              },
              {
                icon: <FaPumpSoap size={32} className="text-[#D4AF37] mb-4" />,
                title: '3. Steam Finishing',
                text: 'Professional pressing for impeccable results',
              },
              {
                icon: <FaSprayCan size={32} className="text-[#D4AF37] mb-4" />,
                title: '4. Fragrance Infusion',
                text: 'Luxury scents for men and women',
              },
              {
                icon: <FaBox size={32} className="text-[#D4AF37] mb-4" />,
                title: '5. Packaging',
                text: 'Choose from our premium wrapping options',
              },
              {
                icon: <FaGift size={32} className="text-[#D4AF37] mb-4" />,
                title: '6. Personalization',
                text: 'Add a custom card for gifts',
              },
              {
                icon: <FaWhatsapp size={32} className="text-[#D4AF37] mb-4" />,
                title: '7. WhatsApp Checkout',
                text: 'Easy confirmation via WhatsApp',
              },
              {
                icon: <FaRobot size={32} className="text-[#D4AF37] mb-4" />,
                title: 'AI Assistance',
                text: '3D avatars guide you in Arabic & English',
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="text-center">
                  {service.icon}
                  <h3 className="text-lg font-medium mb-2">{service.title}</h3>
                  <p className="text-[#2C2C2C] text-sm">{service.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Specialists */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4">Meet Our <span className="text-[#D4AF37]">Fabric Specialists</span></h2>
          <div className="w-24 h-px bg-[#D4AF37] mx-auto my-6"></div>
          <p className="text-[#2C2C2C] max-w-2xl mx-auto mb-12">
            Our team of garment care experts brings decades of combined experience in handling luxury fabrics
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: 'Ahmed Al-Mansoori',
                role: 'Head of Couture Care',
                img: 'https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              },
              {
                name: 'Layla Hassan',
                role: 'Fabric Technology Expert',
                img: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              },
              {
                name: 'Yousef Ibrahim',
                role: 'Operations Director',
                img: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                className="bg-[#f8f5f2] p-8 rounded-xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#D4AF37]"
                />
                <h4 className="text-xl font-medium">{member.name}</h4>
                <p className="text-[#D4AF37] mb-4">{member.role}</p>
                <p className="text-[#2C2C2C] text-sm">
                  {idx === 0 && "20+ years in luxury garment care"}
                  {idx === 1 && "Fabric scientist and preservation expert"}
                  {idx === 2 && "Ensuring seamless service delivery"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;