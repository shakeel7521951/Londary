import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-white text-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              Get In <span className="text-[#D4AF37] underline">Touch</span>
            </h2>
            <p className="text-base sm:text-lg mb-8">
              Have questions or ready to book? Reach out to us anytime.
            </p>

            <div className="space-y-6">
              {/* Reusable contact detail block */}
              {[
                {
                  title: 'Location',
                  value: 'Lucknow, UP, India',
                  iconPath:
                    'M12 11c1.656 0 3-1.343 3-3s-1.344-3-3-3-3 1.343-3 3 1.344 3 3 3zm0 1c-2.667 0-8 1.333-8 4v2h16v-2c0-2.667-5.333-4-8-4z',
                },
                {
                  title: 'Phone',
                  value: '+91 9876543210',
                  iconPath:
                    'M3 5a2 2 0 012-2h1l2 5-2 1a11 11 0 006 6l1-2 5 2v1a2 2 0 01-2 2h-1c-6.627 0-12-5.373-12-12V5z',
                },
                {
                  title: 'Email',
                  value: 'kuldeepprajapati2111@gmail.com',
                  iconPath:
                    'M16 12l-4-4-4 4m8 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m0-4a2 2 0 012-2h8a2 2 0 012 2v4z',
                },
              ].map(({ title, value, iconPath }, i) => (
                <div key={i} className="flex items-start">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-black mt-1 mr-4 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-1">{title}</h3>
                    <p className="text-sm sm:text-base text-black">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {[
                {
                  label: 'Facebook',
                  icon: (
                    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2c0-2 1.2-3 3-3h2v3h-1c-1 0-1 .5-1 1v1h3l-1 3h-2v7A10 10 0 0022 12z" />
                  ),
                },
                {
                  label: 'Instagram',
                  icon: (
                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.5a1 1 0 100 2 1 1 0 000-2z" />
                  ),
                },
                {
                  label: 'Twitter',
                  icon: (
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.26 4.26 0 0016.11 4c-2.36 0-4.27 1.91-4.27 4.27 0 .33.04.66.1.97C7.7 8.99 4.07 7.13 1.64 4.16a4.26 4.26 0 00-.58 2.15c0 1.48.75 2.79 1.88 3.55a4.22 4.22 0 01-1.93-.53v.05c0 2.07 1.47 3.8 3.42 4.19a4.3 4.3 0 01-1.93.07c.55 1.71 2.13 2.96 4 2.99A8.58 8.58 0 012 19.54a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.72 8.72 0 0024 5.5a8.52 8.52 0 01-2.54.7z" />
                  ),
                },
                {
                  label: 'LinkedIn',
                  icon: (
                    <path d="M4.98 3.5a2.5 2.5 0 112.5 2.5 2.5 2.5 0 01-2.5-2.5zM3 8h4v12H3zm6 0h3.8v1.75h.05a4.15 4.15 0 013.7-2.05c3.95 0 4.7 2.6 4.7 5.95V20h-4v-5.5c0-1.3-.02-3-1.85-3-1.86 0-2.15 1.45-2.15 2.9V20h-4z" />
                  ),
                },
              ].map(({ label, icon }, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-amber-300"
                  aria-label={label}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full">
            <h3 className="text-xl sm:text-2xl font-bold mb-6">Send Us a Message</h3>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {['name', 'email'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium mb-1">
                    {field === 'name' ? 'Your Name' : 'Email Address'}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Your message here..."
                  rows="4"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
