import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
        return "text-blue-600 bg-blue-100";
      case "in-transit":
        return "text-yellow-600 bg-yellow-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "normal":
        return "text-blue-600 bg-blue-100";
      case "low":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getDeliveryTypeColor = (type) => {
    return type === "pickup"
      ? "text-orange-600 bg-orange-100"
      : "text-purple-600 bg-purple-100";
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Delivery Management
        </h1>
        <p className="text-gray-600">
          Track and manage all delivery operations
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mr-4">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-800">
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
          className="bg-white p-6 rounded-xl shadow-sm  hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 mr-4">
              <FiTruck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">In Transit</p>
              <p className="text-2xl font-bold text-gray-800">
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
          className="bg-white p-6 rounded-xl shadow-sm  hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 mr-4">
              <FiCheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-gray-800">
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
          className="bg-white p-6 rounded-xl shadow-sm  hover:shadow-md transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 mr-4">
              <FiAlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-800">
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
        className="bg-white rounded-xl shadow-sm p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search deliveries..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deliveries Table */}
      <motion.div
        className="bg-white rounded-xl shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Deliveries ({filteredDeliveries.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Delivery ID
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Driver
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Priority
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Time
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Actions
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
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {delivery.id}
                      </span>
                      <p className="text-sm text-gray-600">
                        {delivery.orderId}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {delivery.customerName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {delivery.customerPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-800">
                        {delivery.driverName}
                      </p>
                      <p className="text-sm text-gray-600">
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
                      {delivery.deliveryType}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {getStatusIcon(delivery.status)}
                      <span>{delivery.status.replace("-", " ")}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        delivery.priority
                      )}`}
                    >
                      {delivery.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {delivery.estimatedTime}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(delivery.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewDeliveryDetails(delivery)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <select
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        value={delivery.status}
                        onChange={(e) =>
                          updateDeliveryStatus(delivery.id, e.target.value)
                        }
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
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
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Delivery Details
                  </h2>
                  <p className="text-sm text-gray-600">
                    #{selectedDelivery.id} - Order #{selectedDelivery.orderId}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Status Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-full ${getStatusColor(
                          selectedDelivery.status
                        )
                          .replace("text-", "bg-")
                          .replace("bg-", "bg-gradient-to-r from-")
                          .replace("-100", "-500 to-")
                          .replace("-600", "-600")}`}
                      >
                        {getStatusIcon(selectedDelivery.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Current Status
                        </h3>
                        <p className="text-gray-600">
                          {selectedDelivery.status
                            .replace("-", " ")
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Time</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {selectedDelivery.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Customer Information */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiUser className="w-5 h-5 mr-2 text-blue-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-800">
                          {selectedDelivery.customerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedDelivery.customerPhone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiMail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedDelivery.customerEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiTruck className="w-5 h-5 mr-2 text-green-600" />
                      Driver Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <FiUser className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-800">
                          {selectedDelivery.driverName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiPhone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedDelivery.driverPhone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FiTruck className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {selectedDelivery.vehicleNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiPackage className="w-5 h-5 mr-2 text-purple-600" />
                      Delivery Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryTypeColor(
                            selectedDelivery.deliveryType
                          )}`}
                        >
                          {selectedDelivery.deliveryType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            selectedDelivery.priority
                          )}`}
                        >
                          {selectedDelivery.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium text-gray-800">
                          {selectedDelivery.distance}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiMapPin className="w-5 h-5 mr-2 text-orange-600" />
                      Pickup Address
                    </h3>
                    <p className="text-gray-700">
                      {selectedDelivery.pickupAddress}
                    </p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiFlag className="w-5 h-5 mr-2 text-indigo-600" />
                      Delivery Address
                    </h3>
                    <p className="text-gray-700">
                      {selectedDelivery.deliveryAddress}
                    </p>
                  </div>
                </div>

                {/* Route Information */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CiRoute className="w-5 h-5 mr-2 text-gray-600" />
                    Route Information
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm">Route</p>
                      <p className="font-medium text-gray-800">
                        {selectedDelivery.route}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Distance</p>
                      <p className="font-medium text-gray-800">
                        {selectedDelivery.distance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FiPackage className="w-5 h-5 mr-2 text-blue-600" />
                    Items
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedDelivery.items.map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-medium text-gray-800">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-gray-600">
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiAlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                      Special Notes
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-gray-700">{selectedDelivery.notes}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium flex items-center space-x-2">
                    <FiNavigation className="w-4 h-4" />
                    <span>Track Delivery</span>
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
