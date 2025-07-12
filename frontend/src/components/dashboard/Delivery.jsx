import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiMapPin,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiPackage,
  FiNavigation,
  FiX,
  FiFlag,
} from "react-icons/fi";
import { CiRoute } from "react-icons/ci";

const Delivery = () => {
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for deliveries
  useEffect(() => {
    const mockDeliveries = [
      {
        id: "DEL001",
        orderId: "ORD001",
        customerName: "John Doe",
        customerPhone: "+1 (555) 123-4567",
        customerEmail: "john.doe@email.com",
        pickupAddress: "123 Main St, City, State 12345",
        deliveryAddress: "456 Oak Ave, City, State 12345",
        driverName: "Mike Wilson",
        driverPhone: "+1 (555) 987-6543",
        vehicleNumber: "TRK-001",
        status: "in-transit",
        deliveryType: "pickup",
        scheduledDate: "2025-07-02",
        estimatedTime: "2:30 PM",
        actualTime: null,
        items: [
          { type: "Shirts", quantity: 3 },
          { type: "Pants", quantity: 2 },
        ],
        priority: "high",
        notes: "Ring doorbell twice, customer works from home",
        distance: "5.2 km",
        route: "Main St → Oak Ave",
      },
      {
        id: "DEL002",
        orderId: "ORD002",
        customerName: "Sarah Wilson",
        customerPhone: "+1 (555) 987-6543",
        customerEmail: "sarah.wilson@email.com",
        pickupAddress: "456 Oak Ave, City, State 12345",
        deliveryAddress: "789 Pine Rd, City, State 12345",
        driverName: "David Brown",
        driverPhone: "+1 (555) 456-7890",
        vehicleNumber: "TRK-002",
        status: "delivered",
        deliveryType: "delivery",
        scheduledDate: "2025-07-01",
        estimatedTime: "10:00 AM",
        actualTime: "9:45 AM",
        items: [
          { type: "Dresses", quantity: 2 },
          { type: "Blouses", quantity: 4 },
        ],
        priority: "normal",
        notes: "Leave with security if not home",
        distance: "8.7 km",
        route: "Oak Ave → Pine Rd → Downtown",
      },
      {
        id: "DEL003",
        orderId: "ORD003",
        customerName: "Michael Brown",
        customerPhone: "+1 (555) 456-7890",
        customerEmail: "michael.brown@email.com",
        pickupAddress: "789 Pine Rd, City, State 12345",
        deliveryAddress: "321 Elm St, City, State 12345",
        driverName: "Alex Johnson",
        driverPhone: "+1 (555) 321-9876",
        vehicleNumber: "TRK-003",
        status: "scheduled",
        deliveryType: "pickup",
        scheduledDate: "2025-07-03",
        estimatedTime: "11:30 AM",
        actualTime: null,
        items: [
          { type: "Suits", quantity: 2 },
          { type: "Ties", quantity: 3 },
        ],
        priority: "normal",
        notes: "Business area, use side entrance",
        distance: "3.4 km",
        route: "Pine Rd → City Center → Elm St",
      },
      {
        id: "DEL004",
        orderId: "ORD004",
        customerName: "Emily Davis",
        customerPhone: "+1 (555) 321-9876",
        customerEmail: "emily.davis@email.com",
        pickupAddress: "321 Elm St, City, State 12345",
        deliveryAddress: "654 Maple Dr, City, State 12345",
        driverName: "Tom Anderson",
        driverPhone: "+1 (555) 654-3210",
        vehicleNumber: "TRK-004",
        status: "failed",
        deliveryType: "delivery",
        scheduledDate: "2025-06-30",
        estimatedTime: "3:00 PM",
        actualTime: "3:15 PM",
        items: [
          { type: "Bedsheets", quantity: 2 },
          { type: "Towels", quantity: 6 },
        ],
        priority: "low",
        notes: "Customer not available, reschedule required",
        distance: "6.1 km",
        route: "Elm St → Residential Area → Maple Dr",
      },
      {
        id: "DEL005",
        orderId: "ORD005",
        customerName: "David Miller",
        customerPhone: "+1 (555) 654-3210",
        customerEmail: "david.miller@email.com",
        pickupAddress: "654 Maple Dr, City, State 12345",
        deliveryAddress: "987 Cedar Ln, City, State 12345",
        driverName: "Chris Taylor",
        driverPhone: "+1 (555) 789-0123",
        vehicleNumber: "TRK-001",
        status: "in-transit",
        deliveryType: "delivery",
        scheduledDate: "2025-07-02",
        estimatedTime: "4:45 PM",
        actualTime: null,
        items: [{ type: "Jackets", quantity: 1 }],
        priority: "high",
        notes: "Fragile items, handle with care",
        distance: "4.8 km",
        route: "Maple Dr → Highway → Cedar Ln",
      },
    ];
    setDeliveries(mockDeliveries);
    setFilteredDeliveries(mockDeliveries);
  }, []);

  // Filter deliveries based on search term and status
  useEffect(() => {
    let filtered = deliveries;

    if (searchTerm) {
      filtered = filtered.filter(
        (delivery) =>
          delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.customerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          delivery.driverName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          delivery.vehicleNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (delivery) => delivery.status === statusFilter
      );
    }

    setFilteredDeliveries(filtered);
  }, [searchTerm, statusFilter, deliveries]);

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-[#BFA134] bg-[#BFA134]/10 border border-[#BFA134]/20";
      case "in-transit":
        return "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20";
      case "delivered":
        return "text-[#F5E1DA] bg-[#F5E1DA]/10 border border-[#F5E1DA]/20";
      case "failed":
        return "text-white/60 bg-white/5 border border-white/10";
      default:
        return "text-white/70 bg-white/10 border border-white/20";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-white/80 bg-white/10 border border-white/20";
      case "normal":
        return "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20";
      case "low":
        return "text-white/60 bg-white/5 border border-white/10";
      default:
        return "text-white/70 bg-white/10 border border-white/20";
    }
  };

  const getDeliveryStatusTranslation = (status) => {
    switch (status) {
      case "scheduled":
        return t("scheduled");
      case "in-transit":
        return t("inTransit");
      case "delivered":
        return t("delivered");
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const getDeliveryTypeTranslation = (type) => {
    switch (type) {
      case "pickup":
        return t("pickupType");
      case "delivery":
        return t("deliveryType");
      default:
        return type;
    }
  };

  const getPriorityTranslation = (priority) => {
    switch (priority) {
      case "high":
        return t("high");
      case "normal":
        return t("normal");
      case "low":
        return t("low");
      default:
        return priority;
    }
  };

  const getDeliveryTypeColor = (type) => {
    return type === "pickup"
      ? "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20"
      : "text-[#BFA134] bg-[#BFA134]/10 border border-[#BFA134]/20";
  };

  const updateDeliveryStatus = (deliveryId, newStatus) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === deliveryId
          ? { ...delivery, status: newStatus }
          : delivery
      )
    );
  };

  const viewDeliveryDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDelivery(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <FiCalendar className="w-4 h-4" />;
      case "in-transit":
        return <FiTruck className="w-4 h-4" />;
      case "delivered":
        return <FiCheckCircle className="w-4 h-4" />;
      case "failed":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
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
          {t("deliveryManagement")}
        </h1>
        <p className="text-white/70">{t("manageCustomers")}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiCalendar className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm  font-medium text-white/70 tracking-wide">
                {t("scheduled")}
              </p>
              <p className="text-2xl font-light text-white">
                {
                  deliveries.filter(
                    (delivery) => delivery.status === "scheduled"
                  ).length
                }
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiTruck className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm  font-medium text-white/70 tracking-wide">
                {t("inTransit")}
              </p>
              <p className="text-2xl font-light text-white">
                {
                  deliveries.filter(
                    (delivery) => delivery.status === "in-transit"
                  ).length
                }
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiCheckCircle className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm  font-medium text-white/70 tracking-wide">
                {t("delivered")}
              </p>
              <p className="text-2xl font-light text-white">
                {
                  deliveries.filter(
                    (delivery) => delivery.status === "delivered"
                  ).length
                }
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] p-6 rounded-xl shadow-lg border border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <div className="p-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#BFA134] mr-4 shadow-lg">
              <FiAlertCircle className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm  font-medium text-white/70 tracking-wide">
                {t("failed")}
              </p>
              <p className="text-2xl font-light text-white">
                {
                  deliveries.filter((delivery) => delivery.status === "failed")
                    .length
                }
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
              placeholder={t("searchDeliveries")}
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
                <option value="scheduled">{t("scheduled")}</option>
                <option value="in-transit">{t("inTransit")}</option>
                <option value="delivered">{t("delivered")}</option>
                <option value="failed">{t("failed")}</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deliveries Table */}
      <motion.div
        className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-[#D4AF37]/30">
          <h2 className="text-lg font-light text-white tracking-wide">
            Deliveries ({filteredDeliveries.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D4AF37]/30">
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("deliveryId")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("customer")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("driver")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("type")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("deliveryStatus")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("priority")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("time")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery, index) => (
                <motion.tr
                  key={delivery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-medium text-white">
                        {delivery.id}
                      </span>
                      <p className="text-sm text-white/70">
                        {delivery.orderId}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center shadow-lg">
                        <FiUser className="w-5 h-5 text-[#1C1C1C]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {delivery.customerName}
                        </p>
                        <p className="text-sm text-white/70">
                          {delivery.customerPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-white">
                        {delivery.driverName}
                      </p>
                      <p className="text-sm text-white/70">
                        {delivery.vehicleNumber}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDeliveryTypeColor(
                        delivery.deliveryType
                      )}`}
                    >
                      {getDeliveryTypeTranslation(delivery.deliveryType)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {getStatusIcon(delivery.status)}
                      <span>
                        {getDeliveryStatusTranslation(delivery.status)}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        delivery.priority
                      )}`}
                    >
                      {getPriorityTranslation(delivery.priority)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {delivery.estimatedTime}
                      </p>
                      <p className="text-xs text-white/70">
                        {new Date(delivery.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewDeliveryDetails(delivery)}
                        className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                        title={t("view")}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <select
                        className="text-sm bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                        value={delivery.status}
                        onChange={(e) =>
                          updateDeliveryStatus(delivery.id, e.target.value)
                        }
                      >
                        <option value="scheduled">{t("scheduled")}</option>
                        <option value="in-transit">{t("inTransit")}</option>
                        <option value="delivered">{t("delivered")}</option>
                        <option value="failed">{t("failed")}</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Delivery Details Modal */}
      {showModal && selectedDelivery && (
        <motion.div
          className="fixed inset-0 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Modal Header */}
              <div className="sticky top-0 bg-[#1C1C1C]/95 backdrop-blur-sm border-b border-[#D4AF37]/20 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {t("deliveryDetails")}
                  </h2>
                  <p className="text-sm text-white/70">
                    #{selectedDelivery.id} - Order #{selectedDelivery.orderId}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-white/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Status Banner */}
                <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30`}
                      >
                        {getStatusIcon(selectedDelivery.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {t("currentStatus")}
                        </h3>
                        <p className="text-white/70">
                          {selectedDelivery.status
                            .replace("-", " ")
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/70">
                        {t("estimatedTime")}
                      </p>
                      <p className="text-lg font-semibold text-[#D4AF37]">
                        {selectedDelivery.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Customer Information */}
                  <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiUser className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("customerInformation")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiUser className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-medium text-white">
                          {selectedDelivery.customerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white/70">
                          {selectedDelivery.customerPhone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiMail className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white/70">
                          {selectedDelivery.customerEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiTruck className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("driverInformation")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiUser className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-medium text-white">
                          {selectedDelivery.driverName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white/70">
                          {selectedDelivery.driverPhone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiTruck className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-white/70">
                          {selectedDelivery.vehicleNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiPackage className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("deliveryInformation")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">{t("type")}:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryTypeColor(
                            selectedDelivery.deliveryType
                          )}`}
                        >
                          {getDeliveryTypeTranslation(
                            selectedDelivery.deliveryType
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">{t("priority")}:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            selectedDelivery.priority
                          )}`}
                        >
                          {getPriorityTranslation(selectedDelivery.priority)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">{t("distance")}:</span>
                        <span className="font-medium text-white">
                          {selectedDelivery.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiMapPin className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("pickupAddress")}
                    </h3>
                    <p className="text-white/80">
                      {selectedDelivery.pickupAddress}
                    </p>
                  </div>
                  <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiFlag className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("deliveryAddress")}
                    </h3>
                    <p className="text-white/80">
                      {selectedDelivery.deliveryAddress}
                    </p>
                  </div>
                </div>

                {/* Route Information */}
                <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <CiRoute className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    {t("routeInformation")}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-white/70 text-sm">{t("route")}</p>
                      <p className="font-medium text-white">
                        {selectedDelivery.route}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">{t("distance")}</p>
                      <p className="font-medium text-[#D4AF37]">
                        {selectedDelivery.distance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FiPackage className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    {t("itemsTable")}
                  </h3>
                  <div className="bg-[#2C2C2C]/50 border border-[#D4AF37]/20 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#1C1C1C]">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                              {t("itemType")}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#D4AF37] uppercase tracking-wider">
                              {t("quantity")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-[#D4AF37]/10">
                          {selectedDelivery.items.map((item, index) => (
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
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedDelivery.notes && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FiAlertCircle className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      {t("specialNotes")}
                    </h3>
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4">
                      <p className="text-white/90">{selectedDelivery.notes}</p>
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
                    <FiNavigation className="w-4 h-4" />
                    <span>{t("trackDelivery")}</span>
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

export default Delivery;
