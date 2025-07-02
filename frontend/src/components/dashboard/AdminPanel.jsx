import React from "react";
import { motion } from "framer-motion";
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
  const stats = [
    {
      title: "Total Orders",
      value: "248",
      change: "+12%",
      icon: FiPackage,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Users",
      value: "156",
      change: "+8%",
      icon: FiUsers,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Revenue",
      value: "$3,248",
      change: "+15%",
      icon: FiDollarSign,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Deliveries",
      value: "189",
      change: "+5%",
      icon: FiTruck,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "#LND001",
      customer: "John Doe",
      status: "In Progress",
      amount: "$24",
    },
    {
      id: "#LND002",
      customer: "Sarah Smith",
      status: "Completed",
      amount: "$36",
    },
    {
      id: "#LND003",
      customer: "Mike Johnson",
      status: "Pending",
      amount: "$18",
    },
    {
      id: "#LND004",
      customer: "Emma Wilson",
      status: "Delivery",
      amount: "$42",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Delivery":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" />
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
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Orders
          </h2>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FiPackage className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
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
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Create New Order</p>
                  <p className="text-sm text-gray-600">
                    Add a new laundry order
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Manage Users</p>
                  <p className="text-sm text-gray-600">
                    View and edit user accounts
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FiTruck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Schedule Delivery</p>
                  <p className="text-sm text-gray-600">Plan delivery routes</p>
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
