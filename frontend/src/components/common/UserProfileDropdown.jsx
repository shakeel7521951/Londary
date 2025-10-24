import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../redux/features/usersApi";
import { logout } from "../../redux/features/authSlice";
import toast from "react-hot-toast";

const UserProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();

      // Clear token from localStorage
      localStorage.removeItem("token");

      dispatch(logout());
      toast.success("Logged out successfully!");
      navigate("/");
      setIsOpen(false);
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  const handleDashboardClick = () => {
    if (isAdmin) {
      navigate("/dashboard");
      setIsOpen(false);
    } else {
      toast.error("Access denied. Admin privileges required.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-[#D4AF37]/10 transition-colors hover:scale-105 active:scale-95"
      >
        {user?.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-[#D4AF37]"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1a1a1a] font-medium text-sm border-2 border-[#D4AF37]">
            {getInitials(user?.name)}
          </div>
        )}
        <span className="text-white text-sm font-medium hidden md:block">
          {user?.name?.split(" ")[0] || "User"}
        </span>
        <svg
          className={`w-4 h-4 text-white transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 transition-all duration-200 ease-in-out">
          {/* User Info Header */}
          <div className="px-4 py-3 bg-[#1a1a1a] text-white">
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-gray-300 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Dashboard Button - Only show for admin */}
            {isAdmin && (
              <button
                onClick={handleDashboardClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
                <span>Dashboard</span>
              </button>
            )}

            {isAdmin && <hr className="my-1 border-gray-200" />}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
