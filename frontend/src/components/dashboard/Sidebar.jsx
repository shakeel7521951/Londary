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
      className="h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl flex flex-col"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ delay: isCollapsed ? 0 : 0.2 }}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-semibold text-white">Londary</h1>
            )}
          </motion.div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
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
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${
                    activeComponent === item.label
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
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

      <div className="p-4 border-t border-slate-700">
        <motion.div
          className="flex items-center space-x-3 px-3 py-2"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ delay: isCollapsed ? 0 : 0.2 }}
        >
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Admin</p>
                <p className="text-slate-400 text-xs">Administrator</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
