import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiPrinter,
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiAlertCircle,
} from "react-icons/fi";

const Order = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for orders
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD001",
        customerName: "John Doe",
        customerPhone: "+1 (555) 123-4567",
        customerEmail: "john.doe@email.com",
        address: "123 Main St, City, State 12345",
        items: [
          { type: "Shirts", quantity: 3, service: "Wash & Iron", price: 15 },
          { type: "Pants", quantity: 2, service: "Dry Clean", price: 20 },
        ],
        total: 35,
        status: "pending",
        orderDate: "2025-07-01",
        pickupDate: "2025-07-02",
        deliveryDate: "2025-07-04",
        paymentStatus: "paid",
        notes: "Please handle with care",
      },
      {
        id: "ORD002",
        customerName: "Sarah Wilson",
        customerPhone: "+1 (555) 987-6543",
        customerEmail: "sarah.wilson@email.com",
        address: "456 Oak Ave, City, State 12345",
        items: [
          { type: "Dresses", quantity: 2, service: "Dry Clean", price: 30 },
          { type: "Blouses", quantity: 4, service: "Wash & Iron", price: 20 },
        ],
        total: 50,
        status: "in-progress",
        orderDate: "2025-06-30",
        pickupDate: "2025-07-01",
        deliveryDate: "2025-07-03",
        paymentStatus: "paid",
        notes: "Urgent delivery required",
      },
      {
        id: "ORD003",
        customerName: "Michael Brown",
        customerPhone: "+1 (555) 456-7890",
        customerEmail: "michael.brown@email.com",
        address: "789 Pine Rd, City, State 12345",
        items: [
          { type: "Suits", quantity: 2, service: "Dry Clean", price: 40 },
          { type: "Ties", quantity: 3, service: "Dry Clean", price: 15 },
        ],
        total: 55,
        status: "completed",
        orderDate: "2025-06-28",
        pickupDate: "2025-06-29",
        deliveryDate: "2025-07-01",
        paymentStatus: "paid",
        notes: "",
      },
      {
        id: "ORD004",
        customerName: "Emily Davis",
        customerPhone: "+1 (555) 321-9876",
        customerEmail: "emily.davis@email.com",
        address: "321 Elm St, City, State 12345",
        items: [
          { type: "Bedsheets", quantity: 2, service: "Wash & Fold", price: 25 },
          { type: "Towels", quantity: 6, service: "Wash & Fold", price: 18 },
        ],
        total: 43,
        status: "delivered",
        orderDate: "2025-06-27",
        pickupDate: "2025-06-28",
        deliveryDate: "2025-06-30",
        paymentStatus: "paid",
        notes: "Customer satisfied",
      },
      {
        id: "ORD005",
        customerName: "David Miller",
        customerPhone: "+1 (555) 654-3210",
        customerEmail: "david.miller@email.com",
        address: "654 Maple Dr, City, State 12345",
        items: [
          { type: "Jackets", quantity: 1, service: "Dry Clean", price: 25 },
        ],
        total: 25,
        status: "pending",
        orderDate: "2025-07-02",
        pickupDate: "2025-07-03",
        deliveryDate: "2025-07-05",
        paymentStatus: "pending",
        notes: "Payment pending",
      },
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on search term and status
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerPhone.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-white/10 text-white/80 border border-white/20";
      case "in-progress":
        return "bg-[#BFA134]/10 text-[#BFA134] border border-[#BFA134]/20";
      case "completed":
        return "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20";
      case "delivered":
        return "bg-[#F5E1DA]/10 text-[#F5E1DA] border border-[#F5E1DA]/20";
      default:
        return "bg-white/5 text-white/60 border border-white/10";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid"
      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
      : "bg-white/10 text-white/80 border border-white/20";
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "pending":
        return t("pending");
      case "in-progress":
        return t("processing");
      case "completed":
        return t("completed");
      case "delivered":
        return t("delivered");
      default:
        return status;
    }
  };

  const getPaymentStatusTranslation = (status) => {
    switch (status) {
      case "paid":
        return t("paid");
      case "pending":
        return t("paymentPending");
      case "unpaid":
        return t("unpaid");
      default:
        return status;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
          {t("orderManagement")}
        </h1>
        <p className="text-white/70">{t("manageCustomers")}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiClock className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("pending")} {t("orders")}
              </p>
              <p className="text-2xl font-light text-white">
                {orders.filter((order) => order.status === "pending").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiPackage className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("processing")}
              </p>
              <p className="text-2xl font-light text-white">
                {
                  orders.filter((order) => order.status === "in-progress")
                    .length
                }
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiCheckCircle className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("completed")}
              </p>
              <p className="text-2xl font-light text-white">
                {orders.filter((order) => order.status === "completed").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiDollarSign className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("total")} {t("revenue")}
              </p>
              <p className="text-2xl font-light text-white">
                ${orders.reduce((sum, order) => sum + order.total, 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              placeholder={t("searchOrders")}
              className="w-full pl-10 pr-4 py-2 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37]" />
              <select
                className="pl-10 pr-4 py-2 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none appearance-none min-w-[150px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t("allStatus")}</option>
                <option value="pending">{t("pending")}</option>
                <option value="in-progress">{t("processing")}</option>
                <option value="completed">{t("completed")}</option>
                <option value="delivered">{t("delivered")}</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-[#D4AF37]/30">
          <h2 className="text-lg font-light text-white tracking-wide">
            Orders ({filteredOrders.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D4AF37]/30">
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("orderId")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("customer")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("date")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("amount")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("status")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("payment")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("view")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="font-medium text-white">{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center shadow-lg">
                        <FiUser className="w-5 h-5 text-[#1C1C1C]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-white/70">
                          {order.customerPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white/70">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-[#D4AF37]">
                      ${order.total}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusTranslation(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {getPaymentStatusTranslation(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                        title={t("view")}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <select
                        className="text-sm bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                      >
                        <option value="pending">{t("pending")}</option>
                        <option value="in-progress">{t("processing")}</option>
                        <option value="completed">{t("completed")}</option>
                        <option value="delivered">{t("delivered")}</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <motion.div
          className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#D4AF37]/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border-b border-[#D4AF37]/30 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-light text-white tracking-wide">
                    {t("orderDetails")}
                  </h2>
                  <p className="text-sm text-white/70">#{selectedOrder.id}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-white/70 hover:text-white hover:bg-[#D4AF37]/20 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Status and Payment Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white/70">
                      {t("status")}:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status === "pending" && (
                        <FiClock className="w-3 h-3 inline mr-1" />
                      )}
                      {selectedOrder.status === "in-progress" && (
                        <FiPackage className="w-3 h-3 inline mr-1" />
                      )}
                      {selectedOrder.status === "completed" && (
                        <FiCheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {selectedOrder.status === "delivered" && (
                        <FiTruck className="w-3 h-3 inline mr-1" />
                      )}
                      {getStatusTranslation(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white/70">
                      {t("payment")}:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                        selectedOrder.paymentStatus
                      )}`}
                    >
                      {selectedOrder.paymentStatus === "paid" ? (
                        <FiCheckCircle className="w-3 h-3 inline mr-1" />
                      ) : (
                        <FiAlertCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {getPaymentStatusTranslation(selectedOrder.paymentStatus)}
                    </span>
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Order Information */}
                  <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-xl p-6">
                    <h3 className="text-lg font-light text-white mb-4 flex items-center tracking-wide">
                      <FiCalendar className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("orderInformation")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">{t("orderDate")}:</span>
                        <span className="font-medium text-white">
                          {new Date(
                            selectedOrder.orderDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">
                          {t("pickupDate")}:
                        </span>
                        <span className="font-medium text-white">
                          {new Date(
                            selectedOrder.pickupDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">
                          {t("deliveryDate")}:
                        </span>
                        <span className="font-medium text-white">
                          {new Date(
                            selectedOrder.deliveryDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">
                          {t("totalAmount")}:
                        </span>
                        <span className="font-bold text-[#D4AF37] text-lg">
                          ${selectedOrder.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-xl p-6">
                    <h3 className="text-lg font-light text-white mb-4 flex items-center tracking-wide">
                      <FiUser className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("customerInformation")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiUser className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-medium text-white">
                          {selectedOrder.customerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white/70">
                          {selectedOrder.customerPhone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiMail className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white/70">
                          {selectedOrder.customerEmail}
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiMapPin className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                        <span className="text-white/70">
                          {selectedOrder.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-light text-white mb-4 flex items-center tracking-wide">
                    <FiPackage className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    {t("orderItems")}
                  </h3>
                  <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1C1C1C] border-b border-[#D4AF37]/30">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                              {t("item")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                              {t("quantity")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                              {t("service")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                              {t("price")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-[#D4AF37]/10">
                          {selectedOrder.items.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-[#D4AF37]/5"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-medium text-white">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-white/70">
                                  {item.quantity}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full border border-[#D4AF37]/30">
                                  {item.service}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-[#D4AF37]">
                                  ${item.price}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-[#1C1C1C]/70 px-6 py-4 border-t border-[#D4AF37]/20">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">
                          {t("totalAmount")}:
                        </span>
                        <span className="text-2xl font-bold text-[#D4AF37]">
                          ${selectedOrder.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiEdit className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("notes")}
                    </h3>
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4">
                      <p className="text-white/90">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-[#D4AF37]/20">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-[#D4AF37]/20 rounded-lg text-white/70 bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors font-medium"
                  >
                    {t("close")}
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C4941F] text-[#1C1C1C] rounded-lg hover:from-[#C4941F] hover:to-[#B8851B] transition-colors font-medium flex items-center space-x-2">
                    <FiPrinter className="w-4 h-4" />
                    <span>{t("printInvoice")}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Order;
