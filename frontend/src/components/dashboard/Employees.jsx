import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiSave,
  FiUserPlus,
  FiBriefcase,
  FiShield,
  FiClock,
  FiPackage,
} from "react-icons/fi";
import {
  useGetAllEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeOrdersQuery,
} from "../../redux/features/employeesApi";
import toast from "react-hot-toast";
import {
  formatPhoneNumber,
  validatePhoneNumber,
  formatCurrency,
} from "../../utils/formatters";

const Employees = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // RTK Query hooks
  const {
    data: employeesData,
    isLoading,
    error,
    refetch,
  } = useGetAllEmployeesQuery();
  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  // Form state for creating new employee
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    password: "",
    whatsappNumber: "",
    department: "laundry",
  });

  // Form state for editing employee
  const [editEmployee, setEditEmployee] = useState({
    name: "",
    email: "",
    whatsappNumber: "",
    department: "laundry",
    status: "active",
  });

  const employees = employeesData?.employees || [];

  // Filter employees based on search term, status, and department
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.whatsappNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-[#F5E1DA] bg-[#F5E1DA]/10 border border-[#F5E1DA]/20";
      case "inactive":
        return "text-white/60 bg-white/5 border border-white/10";
      default:
        return "text-white/70 bg-white/10 border border-white/20";
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case "laundry":
        return "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20";
      case "delivery":
        return "text-[#BFA134] bg-[#BFA134]/10 border border-[#BFA134]/20";
      case "customer_service":
        return "text-[#F5E1DA] bg-[#F5E1DA]/10 border border-[#F5E1DA]/20";
      case "management":
        return "text-white/80 bg-white/10 border border-white/20";
      default:
        return "text-white/70 bg-white/10 border border-white/20";
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "active":
        return t("active") || "Active";
      case "inactive":
        return t("inactive") || "Inactive";
      default:
        return status;
    }
  };

  const getDepartmentTranslation = (department) => {
    switch (department) {
      case "laundry":
        return t("laundry") || "Laundry";
      case "delivery":
        return t("delivery") || "Delivery";
      case "customer_service":
        return t("customerService") || "Customer Service";
      case "management":
        return t("management") || "Management";
      default:
        return department;
    }
  };

  // Handle create employee
  const handleCreateEmployee = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.password ||
      !newEmployee.whatsappNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Normalize and validate WhatsApp number
    const normalizedPhone = formatPhoneNumber(newEmployee.whatsappNumber);
    if (!validatePhoneNumber(normalizedPhone)) {
      toast.error(t("whatsappInvalid"));
      return;
    }

    try {
      await createEmployee({
        ...newEmployee,
        whatsappNumber: normalizedPhone,
      }).unwrap();
      toast.success(t("employeeCreated"));
      setShowCreateModal(false);
      setNewEmployee({
        name: "",
        email: "",
        password: "",
        whatsappNumber: "",
        department: "laundry",
      });
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || t("failedToCreateEmployee"));
    }
  };

  // Handle edit employee
  const handleEditEmployee = async (e) => {
    e.preventDefault();

    if (
      !editEmployee.name ||
      !editEmployee.email ||
      !editEmployee.whatsappNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Normalize and validate WhatsApp number
    const normalizedPhone = formatPhoneNumber(editEmployee.whatsappNumber);
    if (!validatePhoneNumber(normalizedPhone)) {
      toast.error(t("whatsappInvalid"));
      return;
    }

    try {
      await updateEmployee({
        id: editingEmployee._id,
        ...editEmployee,
        whatsappNumber: normalizedPhone,
      }).unwrap();
      toast.success(t("employeeUpdated"));
      setShowEditModal(false);
      setEditingEmployee(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || t("failedToUpdateEmployee"));
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm(t("deleteEmployeeConfirm"))) {
      try {
        await deleteEmployee(employeeId).unwrap();
        toast.success(t("employeeDeleted"));
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || t("failedToDeleteEmployee"));
      }
    }
  };

  // View employee details
  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setEditEmployee({
      name: employee.name,
      email: employee.email,
      whatsappNumber: employee.whatsappNumber,
      department: employee.department,
      status: employee.status,
    });
    setShowEditModal(true);
  };

  // Close modals
  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewEmployee({
      name: "",
      email: "",
      password: "",
      whatsappNumber: "",
      department: "laundry",
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingEmployee(null);
    setEditEmployee({
      name: "",
      email: "",
      whatsappNumber: "",
      department: "laundry",
      status: "active",
    });
  };

  // Calculate stats
  const activeEmployees = employees.filter(
    (emp) => emp.status === "active"
  ).length;
  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "inactive"
  ).length;
  const totalAssignedOrders = employees.reduce(
    (total, emp) => total + (emp.assignedOrders?.length || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-white/70">{t("loadingEmployees")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-transparent min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/70">{t("failedToLoadEmployees")}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-[#D4AF37] text-[#1C1C1C] rounded-lg hover:bg-[#C4941F] transition-colors"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-transparent min-h-screen">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
              {t("employeeManagement")}
            </h1>
            <p className="text-white/70">{t("manageEmployees")}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] text-[#1C1C1C] rounded-xl hover:from-[#C4941F] hover:to-[#B8851B] transition-all duration-300 font-medium shadow-lg"
          >
            <FiUserPlus className="w-5 h-5" />
            <span>{t("addEmployee")}</span>
          </button>
        </div>
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
              <FiUser className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("totalEmployees")}
              </p>
              <p className="text-2xl font-light text-white">
                {employees.length}
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
              <FiCheckCircle className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("activeEmployees")}
              </p>
              <p className="text-2xl font-light text-white">
                {activeEmployees}
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
              <FiAlertCircle className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("inactiveEmployees")}
              </p>
              <p className="text-2xl font-light text-white">
                {inactiveEmployees}
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
              <FiPackage className="w-6 h-6 text-[#1C1C1C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/70 tracking-wide">
                {t("assignedOrders")}
              </p>
              <p className="text-2xl font-light text-white">
                {totalAssignedOrders}
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
              placeholder={t("searchEmployees")}
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
                <option value="active">{t("active")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
            </div>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37]" />
              <select
                className="pl-10 pr-4 py-2 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none appearance-none min-w-[150px]"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">{t("allDepartments")}</option>
                <option value="laundry">{t("laundryDept")}</option>
                <option value="delivery">{t("deliveryDept")}</option>
                <option value="customer_service">{t("customerService")}</option>
                <option value="management">{t("management")}</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Employees Table */}
      <motion.div
        className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="px-6 py-4 border-b border-[#D4AF37]/30">
          <h2 className="text-lg font-light text-white tracking-wide">
            {t("employees")} ({filteredEmployees.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D4AF37]/30">
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("employee")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("contact")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("department")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("status")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("assignedOrders")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("joinedDate")}
                </th>
                <th className="text-left py-3 px-6 font-light text-white tracking-wide">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <motion.tr
                  key={employee._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center shadow-lg">
                        <FiUser className="w-5 h-5 text-[#1C1C1C]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {employee.name}
                        </p>
                        <p className="text-sm text-white/70">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-white/70 flex items-center space-x-1">
                        <FiPhone className="w-4 h-4" />
                        <span>{employee.whatsappNumber}</span>
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getDepartmentColor(
                        employee.department
                      )}`}
                    >
                      {getDepartmentTranslation(employee.department)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${getStatusColor(
                        employee.status
                      )}`}
                    >
                      <FiCheckCircle className="w-3 h-3" />
                      <span>{getStatusTranslation(employee.status)}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-medium">
                      {employee.assignedOrders?.length || 0}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-sm text-white/70">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewEmployeeDetails(employee)}
                        className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                        title={t("view") || "View"}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(employee)}
                        className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-colors"
                        title={t("edit") || "Edit"}
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                        title={t("delete") || "Delete"}
                        disabled={isDeleting}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Employee Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCreateModal}
          >
            <motion.div
              className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {t("addEmployee") || "Add Employee"}
                </h2>
                <button
                  onClick={closeCreateModal}
                  className="p-2 text-white/60 hover:text-[#D4AF37] rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("name") || "Name"} *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="Enter employee name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("email") || "Email"} *
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("password") || "Password"} *
                  </label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        password: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("whatsappNumber") || "WhatsApp Number"} *
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newEmployee.whatsappNumber}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    placeholder="+1234567890"
                    required
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Format: +1234567890
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("department") || "Department"}
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        department: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                  >
                    <option value="laundry">{t("laundry") || "Laundry"}</option>
                    <option value="delivery">
                      {t("delivery") || "Delivery"}
                    </option>
                    <option value="customer_service">
                      {t("customerService") || "Customer Service"}
                    </option>
                    <option value="management">
                      {t("management") || "Management"}
                    </option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="flex-1 px-4 py-2 border border-[#D4AF37]/20 rounded-lg text-white/70 bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors"
                  >
                    {t("cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C4941F] text-[#1C1C1C] rounded-lg hover:from-[#C4941F] hover:to-[#B8851B] transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isCreating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1C1C1C]"></div>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span>{t("create") || "Create"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {showEditModal && editingEmployee && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditModal}
          >
            <motion.div
              className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {t("editEmployee") || "Edit Employee"}
                </h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 text-white/60 hover:text-[#D4AF37] rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("name") || "Name"} *
                  </label>
                  <input
                    type="text"
                    value={editEmployee.name}
                    onChange={(e) =>
                      setEditEmployee({ ...editEmployee, name: e.target.value })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("email") || "Email"} *
                  </label>
                  <input
                    type="email"
                    value={editEmployee.email}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        email: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("whatsappNumber") || "WhatsApp Number"} *
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editEmployee.whatsappNumber}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("department") || "Department"}
                  </label>
                  <select
                    value={editEmployee.department}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        department: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                  >
                    <option value="laundry">{t("laundry") || "Laundry"}</option>
                    <option value="delivery">
                      {t("delivery") || "Delivery"}
                    </option>
                    <option value="customer_service">
                      {t("customerService") || "Customer Service"}
                    </option>
                    <option value="management">
                      {t("management") || "Management"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    {t("status") || "Status"}
                  </label>
                  <select
                    value={editEmployee.status}
                    onChange={(e) =>
                      setEditEmployee({
                        ...editEmployee,
                        status: e.target.value,
                      })
                    }
                    className="w-full p-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
                  >
                    <option value="active">{t("active") || "Active"}</option>
                    <option value="inactive">
                      {t("inactive") || "Inactive"}
                    </option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-2 border border-[#D4AF37]/20 rounded-lg text-white/70 bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors"
                  >
                    {t("cancel") || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C4941F] text-[#1C1C1C] rounded-lg hover:from-[#C4941F] hover:to-[#B8851B] transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1C1C1C]"></div>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span>{t("update") || "Update"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Details Modal */}
      <AnimatePresence>
        {showModal && selectedEmployee && (
          <EmployeeDetailsModal
            employee={selectedEmployee}
            onClose={closeModal}
            t={t}
            currentLanguage={currentLanguage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Employee Details Modal Component
const EmployeeDetailsModal = ({ employee, onClose, t, currentLanguage }) => {
  const { data: ordersData, isLoading: ordersLoading } =
    useGetEmployeeOrdersQuery(employee._id);
  const orders = ordersData?.orders || [];

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] border border-[#D4AF37]/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="sticky top-0 bg-[#1C1C1C]/95 backdrop-blur-sm border-b border-[#D4AF37]/20 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {t("employeeDetails") || "Employee Details"}
              </h2>
              <p className="text-sm text-white/70">
                {employee.name} - {employee.email}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Employee Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiUser className="w-5 h-5 mr-2 text-[#D4AF37]" />
                  {t("personalInformation") || "Personal Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("name") || "Name"}:
                    </span>
                    <span className="text-white font-medium">
                      {employee.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("email") || "Email"}:
                    </span>
                    <span className="text-white font-medium">
                      {employee.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("whatsappNumber") || "WhatsApp"}:
                    </span>
                    <span className="text-white font-medium">
                      {employee.whatsappNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("joinedDate") || "Joined"}:
                    </span>
                    <span className="text-white font-medium">
                      {new Date(employee.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FiBriefcase className="w-5 h-5 mr-2 text-[#D4AF37]" />
                  {t("workInformation") || "Work Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("department") || "Department"}:
                    </span>
                    <span className="text-white font-medium">
                      {employee.department
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("status") || "Status"}:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === "active"
                          ? "text-[#F5E1DA] bg-[#F5E1DA]/10 border border-[#F5E1DA]/20"
                          : "text-white/60 bg-white/5 border border-white/10"
                      }`}
                    >
                      {employee.status.charAt(0).toUpperCase() +
                        employee.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("role") || "Role"}:
                    </span>
                    <span className="text-white font-medium">
                      {employee.role}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {t("assignedOrders") || "Assigned Orders"}:
                    </span>
                    <span className="text-[#D4AF37] font-medium">
                      {employee.assignedOrders?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Orders */}
            <div className="bg-[#1C1C1C]/50 border border-[#D4AF37]/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-[#D4AF37]" />
                {t("assignedOrders") || "Assigned Orders"} ({orders.length})
              </h3>

              {ordersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
                  <p className="text-white/70">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-[#2C2C2C]/50 border border-[#D4AF37]/10 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-sm text-white/70">
                            Customer: {order.userId?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-white/70">
                            Status: {order.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#D4AF37] font-medium">
                            {formatCurrency(order.total, currentLanguage)}
                          </p>
                          <p className="text-xs text-white/70">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiPackage className="w-12 h-12 text-white/30 mx-auto mb-2" />
                  <p className="text-white/70">No orders assigned</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-[#D4AF37]/20 mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-[#D4AF37]/20 rounded-lg text-white/70 bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors font-medium"
              >
                {t("close") || "Close"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Employees;
