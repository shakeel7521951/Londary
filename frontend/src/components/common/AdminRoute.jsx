import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../../redux/features/authSlice";

const AdminRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#1C1C1C]/20 backdrop-blur-lg flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Admin privileges
              are required.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
