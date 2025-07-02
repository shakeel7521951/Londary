import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiSettings,
  FiBarChart2,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: FiHome, label: "Main Panel" },
    { icon: FiUsers, label: "Users" },
    { icon: FiPackage, label: "Orders" },
    { icon: FiTruck, label: "Deliveries" },
    { icon: FiBarChart2, label: "Analytics" },
    { icon: FiDollarSign, label: "Payments" },
    { icon: FiSettings, label: "Settings" },
  ];

  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "80px" },
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      className="h-screen bg-gradient-to-b from-[#1C1C1C] to-[#2C2C2C] shadow-2xl flex flex-col border-r border-[#D4AF37]/20"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 border-b border-[#D4AF37]/30">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ delay: isCollapsed ? 0 : 0.2 }}
          >
            {!isCollapsed && (
              <>
                <svg
                  className="w-8 h-8 text-[#D4AF37]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h1 className="text-xl font-light tracking-wider text-white">
                  LONDARY
                </h1>
              </>
            )}
          </motion.div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-[#D4AF37]/20 transition-colors text-[#D4AF37] hover:text-white"
          >
            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveComponent(item.label);
                }}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  activeComponent === item.label
                    ? "bg-[#D4AF37] text-[#1C1C1C] shadow-lg shadow-[#D4AF37]/25"
                    : "text-white/80 hover:bg-[#D4AF37]/20 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    activeComponent === item.label
                      ? "text-[#1C1C1C]"
                      : "text-[#D4AF37] group-hover:text-white"
                  }`}
                />
                <motion.span
                  className="font-medium"
                  variants={itemVariants}
                  animate={isCollapsed ? "collapsed" : "expanded"}
                  transition={{ duration: 0.2 }}
                >
                  {!isCollapsed && item.label}
                </motion.span>
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#D4AF37]/30">
        <motion.div
          className="flex items-center space-x-3 px-3 py-2"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ delay: isCollapsed ? 0 : 0.2 }}
        >
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center">
                <span className="text-[#1C1C1C] text-sm font-semibold">A</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Admin</p>
                <p className="text-white/60 text-xs">Administrator</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
