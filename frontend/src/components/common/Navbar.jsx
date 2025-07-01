import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = ["Home", "About", "Services", "Contact"];

  return (
    <nav className="bg-[#D4AF37] py-2.5">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto relative">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <span className="self-center text-xl font-bold text-white">Londary</span>
        </a>

        {/* Right side buttons */}
        <div className="flex items-center lg:order-2">
          <a
            href="#"
            className="text-white bg-white/10 hover:bg-white/20 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 transition-colors"
          >
            Login
          </a>

          {/* Mobile toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 text-sm text-white rounded-lg lg:hidden hover:bg-white/20 focus:outline-none"
            aria-controls="mobile-menu-2"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation links */}
        <div
          className={`
            ${isOpen ? "flex" : "hidden"} 
            flex-col items-center space-y-4
            absolute top-full right-0 w-1/2 bg-[#D4AF37] h-screen p-4 z-50 font-bold text-md text-center 
            lg:static lg:flex lg:flex-row lg:space-y-0 lg:space-x-8 lg:w-auto lg:p-0 lg:bg-transparent lg:h-auto
          `}
          id="mobile-menu-2"
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-white hover:bg-white/20 rounded px-4 py-2 transition top-28"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
