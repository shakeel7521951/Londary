import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
} from "react-icons/fi";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 234 567 8900",
      address: "123 Main St, City",
      orders: 12,
      status: "Active",
      joinDate: "Jan 2024",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@email.com",
      phone: "+1 234 567 8901",
      address: "456 Oak Ave, City",
      orders: 8,
      status: "Active",
      joinDate: "Feb 2024",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 234 567 8902",
      address: "789 Pine Rd, City",
      orders: 15,
      status: "Inactive",
      joinDate: "Dec 2023",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      phone: "+1 234 567 8903",
      address: "321 Elm St, City",
      orders: 6,
      status: "Active",
      joinDate: "Mar 2024",
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === "Active"
      ? "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20"
      : "text-white/80 bg-white/10 border border-white/20";
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
          Users Management
        </h1>
        <p className="text-white/70">
          Manage your customer accounts and information.
        </p>
      </div>

      <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
            />
          </div>
          <button className="flex items-center space-x-2 bg-[#D4AF37] text-[#1C1C1C] px-4 py-2 rounded-lg hover:bg-[#BFA134] transition-all duration-300 font-medium">
            <FiPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D4AF37]/30">
                <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                  User
                </th>
                <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                  Contact
                </th>
                <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                  Orders
                </th>
                <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                  Join Date
                </th>
                <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center shadow-lg">
                        <FiUser className="w-5 h-5 text-[#1C1C1C]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-white/70">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiPhone className="w-4 h-4 text-[#D4AF37]" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/70">
                        <FiMapPin className="w-4 h-4 text-[#D4AF37]" />
                        <span>{user.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[#D4AF37]">
                      {user.orders}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-white/70">{user.joinDate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/60 hover:bg-white/10 rounded-lg transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded-lg transition-colors">
                        <FiMail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/70">
              No users found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
