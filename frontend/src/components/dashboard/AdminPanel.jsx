import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";

const AdminPanel = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t("totalOrders"),
      value: "248",
      change: "+12%",
      icon: FiPackage,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
    {
      title: t("totalUsers"),
      value: "156",
      change: "+8%",
      icon: FiUsers,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
    {
      title: t("revenue"),
      value: "$3,248",
      change: "+15%",
      icon: FiDollarSign,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
    {
      title: t("pendingDeliveries"),
      value: "189",
      change: "+5%",
      icon: FiTruck,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
  ];

  const recentOrders = [
    {
      id: "#LND001",
      customer: "John Doe",
      status: t("processing"),
      amount: "$24",
    },
    {
      id: "#LND002",
      customer: "Sarah Smith",
      status: t("completed"),
      amount: "$36",
    },
    {
      id: "#LND003",
      customer: "Mike Johnson",
      status: t("pending"),
      amount: "$18",
    },
    {
      id: "#LND004",
      customer: "Emma Wilson",
      status: t("delivery"),
      amount: "$42",
    },
  ];

  const getStatusColor = (status) => {
    const statusKey = status.toLowerCase();
    switch (statusKey) {
      case t("completed").toLowerCase():
        return "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20";
      case t("processing").toLowerCase():
        return "text-[#BFA134] bg-[#BFA134]/10 border border-[#BFA134]/20";
      case t("pending").toLowerCase():
        return "text-white/80 bg-white/10 border border-white/20";
      case t("delivery").toLowerCase():
        return "text-[#F5E1DA] bg-[#F5E1DA]/10 border border-[#F5E1DA]/20";
      default:
        return "text-white/60 bg-white/5 border border-white/10";
    }
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
          {t("dashboard")}
        </h1>
        <p className="text-white/70">{t("welcomeBack")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium tracking-wide">
                  {stat.title}
                </p>
                <p className="text-2xl font-light text-white mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-[#D4AF37] mr-1" />
                  <span className="text-[#D4AF37] text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-[#1C1C1C]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-4 tracking-wide">
            {t("recentOrders")}
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{order.id}</p>
                    <p className="text-sm text-white/70">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm font-semibold text-[#D4AF37] mt-1">
                    {order.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-4 tracking-wide">
            {t("quickActions")}
          </h2>
          <div className="space-y-3">
            <button className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiPackage className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">{t("addOrder")}</p>
                  <p className="text-sm text-white/70">{t("addOrderDesc")}</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiUsers className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {t("userManagement")}
                  </p>
                  <p className="text-sm text-white/70">
                    {t("viewEditUsersDesc")}
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiTruck className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {t("scheduleDelivery")}
                  </p>
                  <p className="text-sm text-white/70">
                    {t("scheduleDeliveryDesc")}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
