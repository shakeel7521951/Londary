import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "../../redux/features/usersApi";
import {
  FiSearch,
  FiUser,
  FiAlertCircle,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const { t } = useTranslation();

  // API hooks
  const { data: usersData, isLoading, error, refetch } = useGetAllUsersQuery();
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Load users from API
  useEffect(() => {
    if (usersData?.users) {
      // Transform API data to match the component format
      const transformedUsers = usersData.users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        profilePic: user.profilePic,
      }));
      setUsers(transformedUsers);
      console.log("Transformed Users:", transformedUsers);
    }
  }, [usersData, isLoading, error]);

  console.log("Current Users State:", users);

  // Fallback to mock data if API fails or for testing
  useEffect(() => {
    if (error || (!isLoading && !usersData)) {
      const mockUsers = [
        {
          id: "1",
          name: "John Doe",
          email: "john.doe@email.com",
          role: "User",
          status: "verified",
          joinDate: "1/15/2024",
        },
        {
          id: "2",
          name: "Sarah Smith",
          email: "sarah.smith@email.com",
          role: "User",
          status: "verified",
          joinDate: "2/20/2024",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@email.com",
          role: "User",
          status: "unverified",
          joinDate: "12/10/2023",
        },
      ];
      setUsers(mockUsers);
    }
  }, [error, isLoading, usersData]);

  // Filter users based on search term
  useEffect(() => {
    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20";
      case "unverified":
        return "text-white/80 bg-white/10 border border-white/20";
      default:
        return "text-white/60 bg-white/5 border border-white/10";
    }
  };

  // Handle role edit
  const handleEditRole = (userId, currentRole) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setSelectedRole("");
  };

  // Handle save role
  const handleSaveRole = async (userId) => {
    try {
      await updateUserRole({ userId, role: selectedRole }).unwrap();
      alert(t("updated") || "User role updated successfully!");
      setEditingUserId(null);
      setSelectedRole("");
      refetch(); // Refresh the users list
    } catch (error) {
      alert(
        error?.data?.message ||
          t("errorUpdating") ||
          "Failed to update user role"
      );
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId, userName) => {
    if (
      window.confirm(
        `${
          t("deleteConfirm") || "Are you sure you want to delete"
        } ${userName}?`
      )
    ) {
      try {
        await deleteUser(userId).unwrap();
        alert(t("deleted") || "User deleted successfully!");
        refetch(); // Refresh the users list
      } catch (error) {
        alert(
          error?.data?.message || t("errorDeleting") || "Failed to delete user"
        );
      }
    }
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <style>
        {`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
          {t("userManagement")}
        </h1>
        <p className="text-white/70">{t("manageCustomers")}</p>
      </div>

      <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D4AF37]" />
            <input
              type="text"
              placeholder={t("search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
              <span className="text-white/70">{t("loadingUsers")}</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <FiAlertCircle className="w-8 h-8 text-red-400" />
              <span className="text-red-400 font-medium">
                Error loading users
              </span>
            </div>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-[#D4AF37] text-[#1C1C1C] rounded-lg hover:bg-[#BFA134] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && !error && (
          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4AF37]/30">
                  <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                    {t("userName")}
                  </th>
                  <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                    {t("userEmail")}
                  </th>
                  <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                    {t("userStatus")}
                  </th>
                  <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                    Join {t("date")}
                  </th>
                  <th className="text-left py-3 px-4 font-light text-white tracking-wide">
                    {t("actions")}
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
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white/70">{user.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      {editingUserId === user.id ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="bg-[#1C1C1C] border border-[#D4AF37]/30 text-white rounded px-2 py-1 focus:border-[#D4AF37] focus:outline-none"
                        >
                          <option value="User">User</option>
                          <option value="Admin">Admin</option>
                        </select>
                      ) : (
                        <span className="text-white font-medium capitalize">
                          {user.role}
                        </span>
                      )}
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
                      <div className="flex items-center gap-2">
                        {editingUserId === user.id ? (
                          <>
                            <button
                              onClick={() => handleSaveRole(user.id)}
                              disabled={isUpdatingRole}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50"
                              title={t("save")}
                            >
                              <FiSave className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isUpdatingRole}
                              className="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors disabled:opacity-50"
                              title={t("cancel")}
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditRole(user.id, user.role)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                              title={t("edit")}
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteUser(user.id, user.name)
                              }
                              disabled={isDeleting}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                              title={t("delete")}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
