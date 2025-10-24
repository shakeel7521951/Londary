import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiUserCheck,
  FiDollarSign,
  FiSettings,
  FiBarChart2,
  FiMenu,
  FiX,
  FiGift,
  FiSend,
  FiExternalLink,
} from "react-icons/fi";
import LanguageSwitcher from "../common/LanguageSwitcher";

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiHome, label: "Main Panel", translationKey: "mainPanel" },
    { icon: FiUsers, label: "Users", translationKey: "users" },
    { icon: FiPackage, label: "Orders", translationKey: "orders" },
    { icon: FiUserCheck, label: "Employees", translationKey: "employees" },
    {
      icon: FiGift,
      label: "Coupon Management",
      translationKey: "couponManagement",
    },
    { icon: FiSend, label: "Campaigns", translationKey: "campaigns" },
    // { icon: FiBarChart2, label: "Analytics", translationKey: "analytics" },
    // { icon: FiDollarSign, label: "Payments", translationKey: "payments" },
    // { icon: FiSettings, label: "Settings", translationKey: "settings" },
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
      className="h-screen bg-gradient-to-b from-[#1C1C1C] to-[#2C2C2C] shadow-2xl flex flex-col border-r border-[#D4AF37]/20 overflow-hidden"
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
              <img
                src="./companylogo.png"
                alt="AKOYA Premium Laundry"
                loading="lazy"
                className="w-24 h-10 block m-0 p-0"
              />
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

      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-2">
          {/* Home Page Navigation Button */}
          <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group text-white/80 hover:bg-[#D4AF37]/20 hover:text-white border-b border-[#D4AF37]/20 mb-2"
            >
              <FiExternalLink
                size={20}
                className="text-[#D4AF37] group-hover:text-white"
              />
              <motion.span
                className="font-medium"
                variants={itemVariants}
                animate={isCollapsed ? "collapsed" : "expanded"}
                transition={{ duration: 0.2 }}
              >
                {!isCollapsed && (t("goToHomePage") || "Go to Home")}
              </motion.span>
            </a>
          </motion.li>

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
                  {!isCollapsed && t(item.translationKey)}
                </motion.span>
              </a>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#D4AF37]/30">
        <LanguageSwitcher isCollapsed={isCollapsed} />
        <motion.div
          className="flex items-center space-x-3 px-3 py-2 mt-3"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ delay: isCollapsed ? 0 : 0.2 }}
        >
          {!isCollapsed && (
            <>
              <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center">
                <span className="text-[#1C1C1C] text-sm font-semibold">A</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{t("admin")}</p>
                <p className="text-white/60 text-xs">{t("administrator")}</p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
