const Footer = () => {
  return (
    <footer className="bg-[#D4AF37] shadow-lg mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Column 1: Company Info */}
        <div>
          <h3 className="text-xl font-bold text-white">Londary</h3>
          <p className="text-gray-100 mt-3">
            Delivering quality products with a seamless shopping experience.
          </p>
          <p className="text-gray-100 mt-2">© 2024 All rights reserved.</p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div>
          <h3 className="text-xl font-bold text-white">Customer Service</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-100 hover:text-black transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="text-xl font-bold text-white">Stay Updated</h3>
          <p className="text-gray-100 mt-3">
            Subscribe to our newsletter for exclusive deals and updates.
          </p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 pe-16 text-white border border-gray-100 rounded-l-lg focus:outline-none "
            />
            <button className="text-white bg-amber-300 hover:bg-white/20 font-medium rounded text-sm px-4 py-3 lg:px-5 lg:py-2.5 mr-2 transition-colors cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 mt-8 py-4 text-center text-white text-sm">
        Made with ❤️ by Codes Thinker
      </div>
    </footer>
  );
};

export default Footer;
