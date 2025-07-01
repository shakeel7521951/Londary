import React from 'react';
import {
  FaShieldAlt,
  FaUserCheck,
  FaClock,
  FaTshirt,
  FaSprayCan,
  FaBoxOpen,
  FaTags,
  FaWhatsapp,
  FaRobot,
  FaPumpSoap,
  FaBox,
  FaGift,
} from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">

      {/* Hero Banner */}
      <section
        className="py-24 px-6 text-center bg-cover bg-center bg-no-repeat h-[28rem] text-white"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            Empowering Your Business
          </h1>
          <p className="text-xl font-light drop-shadow-md">
            We deliver high-impact digital solutions tailored to accelerate your growth.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <FaShieldAlt size={40} className="text-blue-600 mx-auto mb-4" />,
                title: 'Experienced Team',
                desc: 'Decades of combined industry experience ensure reliable solutions.',
              },
              {
                icon: <FaUserCheck size={40} className="text-blue-600 mx-auto mb-4" />,
                title: 'Client-Centric Approach',
                desc: 'Your vision, our mission. We build around your unique goals.',
              },
              {
                icon: <FaClock size={40} className="text-blue-600 mx-auto mb-4" />,
                title: '24/7 Support',
                desc: 'Round-the-clock assistance from dedicated professionals.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Premium Services */}
      <section className="py-20 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">About AKOYA Premium Laundry</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaTshirt size={32} className="text-blue-600 mb-4" />,
                title: 'Step 1: Select Wash Type',
                text: 'Choose between Standard or Express Wash based on your urgency.',
              },
              {
                icon: <FaBoxOpen size={32} className="text-blue-600 mb-4" />,
                title: 'Step 2: Select Clothes & Quantity',
                text: 'Pick your garments and quantity. From Kanduras to Abayas—we’ve got it all.',
              },
              {
                icon: <FaPumpSoap size={32} className="text-blue-600 mb-4" />,
                title: 'Step 3: Steam Finishing (Optional)',
                text: 'Professional steam finishing for crisp, wrinkle-free clothes.',
              },
              {
                icon: <FaSprayCan size={32} className="text-blue-600 mb-4" />,
                title: 'Step 4: Fragrance Infusion (Optional)',
                text: 'Add luxury with premium scents for men and women.',
              },
              {
                icon: <FaBox size={32} className="text-blue-600 mb-4" />,
                title: 'Step 5: Packaging Style',
                text: 'Choose Plastic Wrap, Fabric Wrap, or our Premium Box.',
              },
              {
                icon: <FaGift size={32} className="text-blue-600 mb-4" />,
                title: 'Step 6: Personalized Card (Optional)',
                text: 'Include a personalized message — great for gifting.',
              },
              {
                icon: <FaWhatsapp size={32} className="text-blue-600 mb-4" />,
                title: 'Step 7: WhatsApp Checkout',
                text: 'Review your order summary and check out with one tap via WhatsApp.',
              },
              {
                icon: <FaRobot size={32} className="text-blue-600 mb-4" />,
                title: '3D Virtual Avatars',
                text: 'AI avatars like Al-Danah guide you in Arabic & English.',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="text-center">
                  {service.icon}
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          {[
            {
              name: 'Fakhar Bhatti',
              role: 'CEO & Founder',
              img: 'https://images.unsplash.com/photo-1603415526960-f8f0b0ef6e1e?w=500&auto=format&fit=crop&q=60',
            },
            {
              name: 'Sara Khan',
              role: 'Project Manager',
              img: 'https://images.unsplash.com/photo-1676146260135-50a95127afa7?w=500&auto=format&fit=crop&q=60',
            },
            {
              name: 'Ayesha Tariq',
              role: 'Lead Developer',
              img: 'https://images.unsplash.com/photo-1702369412530-0a4ab9980f9e?w=500&auto=format&fit=crop&q=60',
            },
          ].map((member, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <img
                src={member.img}
                alt={`${member.name} - ${member.role}`}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
              />
              <h4 className="text-xl font-bold">{member.name}</h4>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
