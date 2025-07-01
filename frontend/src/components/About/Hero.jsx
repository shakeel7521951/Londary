import React from 'react';

const Hero = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Who We Are</h1>
        <p className="text-lg max-w-2xl mx-auto">
          We are a passionate team delivering top-quality services to help your business grow and succeed.
        </p>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
        <p className="max-w-3xl mx-auto text-gray-700">
          Our mission is to provide reliable, affordable, and innovative services that empower our clients and foster lasting relationships.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            { title: "Experienced Team", desc: "We bring years of industry experience and insight to every project." },
            { title: "Customer First", desc: "Your satisfaction is our top priority, always." },
            { title: "24/7 Support", desc: "We’re here when you need us — anytime, any day." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Team */}
      <section className="bg-gray-50 py-16 px-6">
        <h2 className="text-3xl font-semibold text-center mb-10">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            { name: "Ali Raza", role: "CEO & Founder", img: "https://via.placeholder.com/150" },
            { name: "Sara Khan", role: "Project Manager", img: "https://via.placeholder.com/150" },
            { name: "Usman Tariq", role: "Lead Developer", img: "https://via.placeholder.com/150" },
          ].map((member, idx) => (
            <div key={idx} className="p-4">
              <img src={member.img} alt={member.name} className="w-32 h-32 mx-auto rounded-full mb-4" />
              <h4 className="text-xl font-bold">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
